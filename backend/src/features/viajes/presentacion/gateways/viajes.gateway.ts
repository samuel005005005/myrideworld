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
import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { WsJwtGuard } from '../../../../compartidos/middlewares/ws-jwt.guard.js';
import type { INotificadorViaje } from '../../aplicacion/puertos/notificador-viaje.port.js';
import type { ViajeDisponibleNotificacion } from '../../aplicacion/puertos/viaje-disponible-notificacion.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import type { ViajeAceptadoNotificacion } from '../../aplicacion/puertos/viaje-aceptado-notificacion.js';
import type { ViajeCompletadoNotificacion } from '../../aplicacion/puertos/viaje-completado-notificacion.js';
import {
  clavesSalasFlotaAlrededor,
} from '../../../../compartidos/utilidades/geo-flota.util.js';
import { OfertasViajeActivasRegistry } from '../../aplicacion/servicios/ofertas-viaje-activas.registry.js';
import { OfertarViajesPendientesConductorUseCase } from '../../aplicacion/casos-uso/ofertar-viajes-pendientes-conductor.use-case.js';

type SocketAutenticado = Socket & {
  user?: { sub: string; rol: string };
  data: {
    salasFlota?: string[];
    salasFlotaConductor?: string[];
  };
};

const INTERVALO_GPS_MS = 3000;

@Injectable()
@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGINS ?? '*').split(',').map((o) => o.trim()),
  },
})
@UseGuards(WsJwtGuard)
export class ViajesGateway
  implements OnGatewayConnection, OnGatewayDisconnect, INotificadorViaje
{
  private readonly logger = new Logger(ViajesGateway.name);
  private readonly ultimaPersistenciaGps = new Map<string, number>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
    private readonly ofertas: OfertasViajeActivasRegistry,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: SocketAutenticado) {
    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) throw new Error(MENSAJES.EXCEPCIONES.AUTH.TOKEN_AUSENTE);

      const payload = await this.jwtService.verifyAsync(token, { secret });
      client.user = payload;
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
      this._emitirFueraDeFlota(client, user.sub);
    }
    // No marcar DESCONECTADO: el conductor puede seguir en línea con FCM
    // (app cerrada / sin socket). Solo sale con PATCH disponibilidad.
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

    const esParticipante =
      viaje.pasajeroId === user.sub ||
      viaje.conductorId === user.sub ||
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
    // Tras unirse a la sala: reenviar oferta en memoria o buscar pendientes.
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

    const salasPrevias = client.data.salasFlotaConductor ?? [];
    const salas = clavesSalasFlotaAlrededor(data.lat, data.lng);
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
    for (const sala of salas) {
      this.server.to(sala).emit('ubicacionConductorFlota', payload);
    }
  }

  @SubscribeMessage('salirDeFlota')
  handleSalirDeFlota(@ConnectedSocket() client: SocketAutenticado) {
    const user = client.user;
    if (!user?.sub || user.rol !== Roles.CONDUCTOR) {
      return;
    }
    this._emitirFueraDeFlota(client, user.sub);
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
    client.to(room).emit('ubicacionActualizada', {
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

  cancelarOfertaViaje(conductorId: string, viajeId: string) {
    const room = `conductor_${conductorId}`;
    this.server.to(room).emit('ofertaViajeCancelada', { viajeId });
    this.logger.log(`Oferta cancelada viaje ${viajeId} → ${conductorId}`);
  }

  notificarViajeAceptado(notificacion: ViajeAceptadoNotificacion) {
    const room = `viaje_${notificacion.viajeId}`;
    this.server.to(room).emit('viajeAceptado', notificacion);
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
  ) {
    const payload = { viajeId, actor, motivo };
    this.server.to(`viaje_${viajeId}`).emit('viajeCancelado', payload);
    if (conductorId) {
      this.server
        .to(`conductor_${conductorId}`)
        .emit('viajeCancelado', payload);
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

  private _salirSalasFlotaPasajero(client: SocketAutenticado) {
    const salas = client.data.salasFlota ?? [];
    for (const sala of salas) {
      client.leave(sala);
    }
    client.data.salasFlota = [];
  }

  private _emitirFueraDeFlota(client: SocketAutenticado, conductorId: string) {
    const salas = client.data.salasFlotaConductor ?? [];
    for (const sala of salas) {
      this.server.to(sala).emit('conductorFueraDeFlota', { conductorId });
      client.leave(sala);
    }
    client.data.salasFlotaConductor = [];
  }

  /**
   * Al unirse a su sala: reemite oferta ya asignada (si el socket no estaba)
   * o busca viajes Solicitado/Buscando pendientes.
   */
  private async _sincronizarOfertasAlConectar(
    conductorId: string,
  ): Promise<void> {
    try {
      const viajeIdActivo = this.ofertas.viajeIdDeConductor(conductorId);
      if (viajeIdActivo) {
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
          return;
        }
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
