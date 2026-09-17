import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { WsJwtGuard } from '../../../../compartidos/middlewares/ws-jwt.guard.js';
import type { INotificadorViaje } from '../../aplicacion/puertos/notificador-viaje.port.js';
import type { ViajeDisponibleNotificacion } from '../../aplicacion/puertos/viaje-disponible-notificacion.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import type { ViajeAceptadoNotificacion } from '../../aplicacion/puertos/viaje-aceptado-notificacion.js';
import type { ViajeCompletadoNotificacion } from '../../aplicacion/puertos/viaje-completado-notificacion.js';
import type { EstadoViajeSocketPayload } from '../../aplicacion/puertos/estado-viaje-socket-payload.js';
import {
  clavesSalasFlotaAlrededor,
  claveSalaFlota,
} from '../../../../compartidos/utilidades/geo-flota.util.js';
import { OfertasViajeActivasRegistry } from '../../aplicacion/servicios/ofertas-viaje-activas.registry.js';
import { OfertarViajesPendientesConductorUseCase } from '../../aplicacion/casos-uso/ofertar-viajes-pendientes-conductor.use-case.js';
import { FlotaConductoresActivosRegistry } from '../../../conductores/aplicacion/servicios/flota-conductores-activos.registry.js';
import { SesionesActivasRegistry } from '../../../../compartidos/seguridad/sesiones-activas.registry.js';
import type { JwtClaims } from '../../../../compartidos/seguridad/jwt-claims.js';
import { ViajeMapper } from '../../aplicacion/mappers/viaje.mapper.js';
import { ConductorMapper } from '../../../conductores/aplicacion/mappers/conductor.mapper.js';
import { PasajeroMapper } from '../../../pasajeros/aplicacion/mappers/pasajero.mapper.js';

type SocketAutenticado = Socket & {
  user?: JwtClaims;
  data: {
    sid?: string;
    salasFlota?: string[];
    salasFlotaConductor?: string[];
  };
};

const INTERVALO_GPS_MS = 10_000;
const RETRASO_KICK_MS = 150;

@Injectable()
@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGINS ?? '*').split(',').map((o) => o.trim()),
  },
})
@UseGuards(WsJwtGuard)
export class ViajesGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    INotificadorViaje
{
  private readonly logger = new Logger(ViajesGateway.name);
  private readonly ultimaPersistenciaGps = new Map<string, number>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
    private readonly ofertas: OfertasViajeActivasRegistry,
    private readonly flotaActiva: FlotaConductoresActivosRegistry,
    private readonly sesionesActivas: SesionesActivasRegistry,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.sesionesActivas.registrarExpulsor((userId, sidVigente) => {
      void this._expulsarSesionesAnteriores(userId, sidVigente);
      void this._revocarPresenciaConductor(userId);
    });
  }

  async handleConnection(client: SocketAutenticado) {
    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) throw new Error(MENSAJES.EXCEPCIONES.AUTH.TOKEN_AUSENTE);

      const payload = await this.jwtService.verifyAsync<JwtClaims>(token, {
        secret,
      });
      if (!this.sesionesActivas.esVigente(payload.sub, payload.sid)) {
        this._notificarSesionReemplazada(client);
        return;
      }

      client.user = payload;
      client.data.sid = payload.sid;
      client.join(`usuario_${payload.sub}`);
      // Un solo socket vivo por cuenta: cierra otras pestañas/emuladores.
      await this._expulsarSesionesAnteriores(
        payload.sub,
        payload.sid,
        client.id,
      );
      this.logger.log(
        `Cliente autenticado y conectado a Sockets: ${client.id} (Rol: ${payload.rol})`,
      );
    } catch {
      this.logger.warn(
        `Cliente rechazado en Sockets (Sin token / Inválido): ${client.id}`,
      );
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: SocketAutenticado) {
    this.logger.log(`Cliente desconectado de Sockets: ${client.id}`);
    const user = client.user;
    if (user?.rol === Roles.CONDUCTOR && user.sub) {
      // Solo sale del mapa; NO borra flotaActiva (TTL 90s) para que
      // blips de red no lo saquen del pool de ofertas.
      this._emitirFueraDeFlota(client, user.sub, { retirarDelRegistry: false });
    }
  }

  @SubscribeMessage('unirseAViaje')
  async handleUnirseAViaje(
    @ConnectedSocket() client: SocketAutenticado,
    @MessageBody() data: { viajeId: string },
  ) {
    const user = client.user;
    if (!user?.sub || !data?.viajeId) {
      return;
    }

    const viaje = await this.viajeRepository.obtenerPorId(data.viajeId);
    if (!viaje) {
      return;
    }

    const ofertadoAlConductor =
      user.rol === Roles.CONDUCTOR &&
      this.ofertas.tieneOferta(data.viajeId, user.sub);

    const esParticipante =
      viaje.pasajeroId === user.sub ||
      viaje.conductorId === user.sub ||
      ofertadoAlConductor ||
      user.rol === Roles.ADMIN;

    if (!esParticipante) {
      this.logger.warn(
        `${MENSAJES.EXCEPCIONES.VIAJES.SALA_NO_AUTORIZADA} user=${user.sub} viaje=${data.viajeId}`,
      );
      return;
    }

    const room = `viaje_${data.viajeId}`;
    client.join(room);
    this.logger.log(`Cliente ${client.id} se unió a la sala ${room}`);
    await this._emitirEstadoViajeAlCliente(client, data.viajeId);
  }

  @SubscribeMessage('salirDeViaje')
  handleSalirDeViaje(
    @ConnectedSocket() client: SocketAutenticado,
    @MessageBody() data: { viajeId: string },
  ) {
    if (!data?.viajeId) {
      return;
    }
    const room = `viaje_${data.viajeId}`;
    client.leave(room);
    this.logger.log(`Cliente ${client.id} salió de la sala ${room}`);
  }

  @SubscribeMessage('identificarConductor')
  handleIdentificarConductor(@ConnectedSocket() client: SocketAutenticado) {
    const user = client.user;
    if (!user?.sub || user.rol !== Roles.CONDUCTOR) {
      return;
    }

    const room = `conductor_${user.sub}`;
    client.join(room);
    this.logger.log(
      `Conductor ${user.sub} (Socket ${client.id}) se unió a su sala privada ${room}`,
    );
    void this._activarFlotaSiCorresponde(user.sub);
    void this._sincronizarOfertasAlConectar(user.sub);
  }

  @SubscribeMessage('observarFlota')
  handleObservarFlota(
    @ConnectedSocket() client: SocketAutenticado,
    @MessageBody() data: { lat: number; lng: number },
  ) {
    const user = client.user;
    if (!user?.sub || user.rol !== Roles.PASAJERO) {
      return;
    }
    if (typeof data?.lat !== 'number' || typeof data?.lng !== 'number') {
      return;
    }

    this._salirSalasFlotaPasajero(client);
    const salas = clavesSalasFlotaAlrededor(data.lat, data.lng);
    for (const sala of salas) {
      client.join(sala);
    }
    client.data.salasFlota = salas;
  }

  @SubscribeMessage('dejarDeObservarFlota')
  handleDejarDeObservarFlota(@ConnectedSocket() client: SocketAutenticado) {
    const user = client.user;
    if (!user?.sub || user.rol !== Roles.PASAJERO) {
      return;
    }
    this._salirSalasFlotaPasajero(client);
  }

  @SubscribeMessage('publicarUbicacionFlota')
  async handlePublicarUbicacionFlota(
    @ConnectedSocket() client: SocketAutenticado,
    @MessageBody() data: { lat: number; lng: number },
  ) {
    const user = client.user;
    if (!user?.sub || user.rol !== Roles.CONDUCTOR) {
      return;
    }
    if (typeof data?.lat !== 'number' || typeof data?.lng !== 'number') {
      return;
    }

    const conductor = await this.conductorRepository.obtenerPorId(user.sub);
    if (
      !conductor ||
      conductor.estadoDisponibilidad !== EstadosDisponibilidadConductor.CONECTADO
    ) {
      return;
    }

    const ahora = Date.now();
    const ultimo = this.ultimaPersistenciaGps.get(user.sub) ?? 0;
    if (ahora - ultimo >= INTERVALO_GPS_MS) {
      this.ultimaPersistenciaGps.set(user.sub, ahora);
      conductor.actualizarUbicacion(data.lat, data.lng);
      await this.conductorRepository.guardar(conductor);
    }

    this.flotaActiva.tocar(user.sub);

    const salasPrevias = client.data.salasFlotaConductor ?? [];
    // Escucha/publica vecinos para cobertura, pero emite UNA sola vez
    // en la celda home para no multiplicar eventos a pasajeros.
    const salas = clavesSalasFlotaAlrededor(data.lat, data.lng);
    const salaHome = claveSalaFlota(data.lat, data.lng);
    for (const sala of salasPrevias) {
      if (!salas.includes(sala)) {
        client.leave(sala);
      }
    }
    for (const sala of salas) {
      client.join(sala);
    }
    client.data.salasFlotaConductor = salas;

    const payload = {
      id: user.sub,
      conductorId: user.sub,
      lat: data.lat,
      lng: data.lng,
      vehiculoColor: conductor.vehiculoColor,
      timestamp: new Date().toISOString(),
    };
    this.server.to(salaHome).emit('ubicacionConductorFlota', payload);
  }

  @SubscribeMessage('salirDeFlota')
  handleSalirDeFlota(@ConnectedSocket() client: SocketAutenticado) {
    const user = client.user;
    if (!user?.sub || user.rol !== Roles.CONDUCTOR) {
      return;
    }
    this._emitirFueraDeFlota(client, user.sub, { retirarDelRegistry: true });
  }

  @SubscribeMessage('actualizarUbicacion')
  async handleActualizarUbicacion(
    @ConnectedSocket() client: SocketAutenticado,
    @MessageBody() data: { viajeId: string; lat: number; lng: number },
  ) {
    const user = client.user;
    if (!user?.sub || user.rol !== Roles.CONDUCTOR) {
      return;
    }
    if (
      typeof data?.lat !== 'number' ||
      typeof data?.lng !== 'number' ||
      !data?.viajeId
    ) {
      return;
    }

    const viaje = await this.viajeRepository.obtenerPorId(data.viajeId);
    if (!viaje || viaje.conductorId !== user.sub) {
      return;
    }

    const ahora = Date.now();
    const ultimo = this.ultimaPersistenciaGps.get(user.sub) ?? 0;
    if (ahora - ultimo >= INTERVALO_GPS_MS) {
      this.ultimaPersistenciaGps.set(user.sub, ahora);
      const conductor = await this.conductorRepository.obtenerPorId(user.sub);
      if (conductor) {
        conductor.actualizarUbicacion(data.lat, data.lng);
        await this.conductorRepository.guardar(conductor);
      }
    }

    const room = `viaje_${data.viajeId}`;
    // Incluye a todos en la sala (el conductor no necesita eco; el pasajero sí).
    this.server.to(room).emit('ubicacionActualizada', {
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date().toISOString(),
    });
  }

  notificarNuevoViaje(
    conductorId: string,
    viaje: ViajeDisponibleNotificacion,
  ) {
    const room = `conductor_${conductorId}`;
    this.server.to(room).emit('nuevoViajeDisponible', viaje);
    this.logger.log(`Notificado viaje ${viaje.id} al conductor ${conductorId}`);
  }

  retirarOfertaDeConductor(viajeId: string, conductorId: string): void {
    // El compuesto maneja registry/timeout/push; el gateway solo cancela socket.
    this.cancelarOfertaViaje(conductorId, viajeId);
  }

  cancelarOfertaViaje(conductorId: string, viajeId: string) {
    const room = `conductor_${conductorId}`;
    this.server.to(room).emit('ofertaViajeCancelada', { viajeId });
    this.logger.log(`Oferta cancelada viaje ${viajeId} → ${conductorId}`);
  }

  notificarViajeAceptado(notificacion: ViajeAceptadoNotificacion) {
    const room = `viaje_${notificacion.viajeId}`;
    this.server.to(room).emit('viajeAceptado', notificacion);
    const lat = notificacion.conductor?.lat;
    const lng = notificacion.conductor?.lng;
    if (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {
      this.server.to(room).emit('ubicacionActualizada', {
        lat,
        lng,
        timestamp: new Date().toISOString(),
      });
    }
  }

  notificarConductorLlego(viajeId: string) {
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('conductorLlego', { viajeId });
  }

  notificarViajeCancelado(
    viajeId: string,
    actor: string,
    motivo: string | undefined,
    conductorId?: string | null,
    conductoresOfertados: string[] = [],
  ) {
    const payload = { viajeId, actor, motivo };
    this.server.to(`viaje_${viajeId}`).emit('viajeCancelado', payload);
    const destinos = new Set<string>(conductoresOfertados);
    if (conductorId) {
      destinos.add(conductorId);
    }
    for (const id of destinos) {
      this.server.to(`conductor_${id}`).emit('viajeCancelado', payload);
    }
  }

  notificarViajeIniciado(viajeId: string) {
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('viajeIniciado', { viajeId });
  }

  notificarViajeCompletado(notificacion: ViajeCompletadoNotificacion) {
    const room = `viaje_${notificacion.viajeId}`;
    this.server.to(room).emit('viajeCompletado', {
      viajeId: notificacion.viajeId,
      tarifaEstimada: notificacion.tarifaEstimada,
      distancia: notificacion.distanciaKm,
      distanciaKm: notificacion.distanciaKm,
      duracionMinutos: notificacion.duracionMinutos,
    });
  }

  private async _emitirEstadoViajeAlCliente(
    client: SocketAutenticado,
    viajeId: string,
  ): Promise<void> {
    try {
      const viaje = await this.viajeRepository.obtenerPorId(viajeId);
      if (!viaje) {
        return;
      }

      let conductorResumen = null;
      let ubicacionConductor: { lat: number; lng: number } | null = null;
      if (viaje.conductorId) {
        const conductor = await this.conductorRepository.obtenerPorId(
          viaje.conductorId,
        );
        if (conductor) {
          conductorResumen = ConductorMapper.toResumenPublico(conductor);
          if (
            conductor.ultimaUbicacionLat !== null &&
            conductor.ultimaUbicacionLng !== null
          ) {
            ubicacionConductor = {
              lat: conductor.ultimaUbicacionLat,
              lng: conductor.ultimaUbicacionLng,
            };
          }
        }
      }

      let pasajeroResumen = null;
      const pasajero = await this.pasajeroRepository.obtenerPorId(
        viaje.pasajeroId,
      );
      if (pasajero) {
        pasajeroResumen = PasajeroMapper.toResumenPublico(pasajero);
      }

      const base = ViajeMapper.toResponse(
        viaje,
        conductorResumen,
        pasajeroResumen,
      );
      const payload: EstadoViajeSocketPayload = {
        ...base,
        ubicacionConductor,
      };
      client.emit('estadoViaje', payload);
    } catch (error) {
      this.logger.warn(
        `No se pudo sincronizar estado del viaje ${viajeId}: ${String(error)}`,
      );
    }
  }

  private async _expulsarSesionesAnteriores(
    userId: string,
    sidVigente: string,
    conservarSocketId?: string,
  ): Promise<void> {
    if (!this.server) {
      return;
    }
    try {
      const sockets = await this.server.in(`usuario_${userId}`).fetchSockets();
      for (const remoto of sockets) {
        if (conservarSocketId && remoto.id === conservarSocketId) {
          continue;
        }
        const sidRemoto = (remoto.data as { sid?: string }).sid;
        // Mismo sid = reconexión del mismo dispositivo: no forzar logout.
        if (sidRemoto && sidRemoto === sidVigente) {
          remoto.disconnect(true);
          continue;
        }
        this._notificarSesionReemplazada(remoto);
      }
    } catch (error) {
      this.logger.warn(
        `No se pudo expulsar sesiones de ${userId}: ${String(error)}`,
      );
    }
  }

  private _notificarSesionReemplazada(remoto: {
    emit: (evento: string, payload: { motivo: string }) => void;
    disconnect: (cerrar?: boolean) => void;
  }): void {
    remoto.emit('sesionReemplazada', {
      motivo: MENSAJES.EXCEPCIONES.AUTH.SESION_OTRO_DISPOSITIVO,
    });
    setTimeout(() => {
      remoto.disconnect(true);
    }, RETRASO_KICK_MS);
  }

  /** Login nuevo: el dispositivo anterior no debe seguir en flota ni recibir FCM. */
  private async _revocarPresenciaConductor(userId: string): Promise<void> {
    try {
      this.flotaActiva.salir(userId);
      const conductor = await this.conductorRepository.obtenerPorId(userId);
      if (!conductor) {
        return;
      }
      conductor.registrarTokenPush(null);
      if (
        conductor.estadoDisponibilidad ===
        EstadosDisponibilidadConductor.CONECTADO
      ) {
        conductor.actualizarDisponibilidad(
          EstadosDisponibilidadConductor.DESCONECTADO,
        );
      }
      await this.conductorRepository.guardar(conductor);
    } catch (error) {
      this.logger.warn(
        `No se pudo revocar presencia del conductor ${userId}: ${String(error)}`,
      );
    }
  }

  private _salirSalasFlotaPasajero(client: SocketAutenticado) {
    const salas = client.data.salasFlota ?? [];
    for (const sala of salas) {
      client.leave(sala);
    }
    client.data.salasFlota = [];
  }

  private _emitirFueraDeFlota(
    client: SocketAutenticado,
    conductorId: string,
    opciones: { retirarDelRegistry: boolean } = { retirarDelRegistry: true },
  ) {
    if (opciones.retirarDelRegistry) {
      this.flotaActiva.salir(conductorId);
    }
    const salas = client.data.salasFlotaConductor ?? [];
    for (const sala of salas) {
      this.server.to(sala).emit('conductorFueraDeFlota', { conductorId });
      client.leave(sala);
    }
    client.data.salasFlotaConductor = [];
  }

  /** Evita ventana sin ofertas entre "Conectado" y el primer GPS de flota. */
  private async _activarFlotaSiCorresponde(conductorId: string): Promise<void> {
    try {
      const conductor = await this.conductorRepository.obtenerPorId(conductorId);
      if (
        !conductor ||
        conductor.estadoDisponibilidad !==
          EstadosDisponibilidadConductor.CONECTADO
      ) {
        return;
      }
      if (
        conductor.ultimaUbicacionLat === null ||
        conductor.ultimaUbicacionLng === null
      ) {
        return;
      }
      this.flotaActiva.tocar(conductorId);
    } catch (error) {
      this.logger.warn(
        `No se pudo activar flota al identificar ${conductorId}: ${String(error)}`,
      );
    }
  }

  /**
   * Al unirse a su sala: reemite ofertas en memoria o busca pendientes.
   */
  private async _sincronizarOfertasAlConectar(
    conductorId: string,
  ): Promise<void> {
    try {
      const viajesActivos = this.ofertas.viajesIdsDeConductor(conductorId);
      for (const viajeIdActivo of viajesActivos) {
        const viaje = await this.viajeRepository.obtenerPorId(viajeIdActivo);
        if (
          viaje &&
          (viaje.estado === EstadosViaje.SOLICITADO ||
            viaje.estado === EstadosViaje.BUSCANDO)
        ) {
          this.notificarNuevoViaje(conductorId, {
            id: viaje.id,
            origenLat: viaje.origenLat,
            origenLng: viaje.origenLng,
            destinoLat: viaje.destinoLat,
            destinoLng: viaje.destinoLng,
            tarifaEstimada: Number(viaje.tarifaEstimada),
            origenDireccion: viaje.origenDireccion,
            destinoDireccion: viaje.destinoDireccion,
          });
        }
      }
      if (viajesActivos.length > 0) {
        return;
      }

      const ofertar = this.moduleRef.get(OfertarViajesPendientesConductorUseCase, {
        strict: false,
      });
      await ofertar.ejecutar(conductorId);
    } catch (error) {
      this.logger.warn(
        `No se pudo sincronizar ofertas al conectar ${conductorId}: ${String(error)}`,
      );
    }
  }
}
