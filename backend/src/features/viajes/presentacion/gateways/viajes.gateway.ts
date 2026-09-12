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
import type { ViajeAceptadoNotificacion } from '../../aplicacion/puertos/viaje-aceptado-notificacion.js';

type SocketAutenticado = Socket & {
  user?: { sub: string; rol: string };
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
    if (!user?.sub || user.rol !== Roles.CONDUCTOR) {
      return;
    }

    try {
      const conductor = await this.conductorRepository.obtenerPorId(user.sub);
      if (!conductor) {
        return;
      }
      if (
        conductor.estadoDisponibilidad ===
        EstadosDisponibilidadConductor.CONECTADO
      ) {
        conductor.actualizarDisponibilidad(
          EstadosDisponibilidadConductor.DESCONECTADO,
        );
        await this.conductorRepository.guardar(conductor);
      }
    } catch (error) {
      this.logger.warn(
        `No se pudo marcar conductor ${user.sub} como desconectado: ${String(error)}`,
      );
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
  ) {
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('viajeCancelado', { viajeId, actor, motivo });
  }

  notificarViajeIniciado(viajeId: string) {
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('viajeIniciado', { viajeId });
  }

  notificarViajeCompletado(viajeId: string, tarifaEstimada: number) {
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('viajeCompletado', { viajeId, tarifaEstimada });
  }
}
