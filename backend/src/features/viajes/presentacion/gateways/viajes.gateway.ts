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
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { WsJwtGuard } from '../../../../compartidos/middlewares/ws-jwt.guard.js';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class ViajesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ViajesGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET', 'super-secret-key');
      const token = client.handshake.auth?.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) throw new Error(MENSAJES.EXCEPCIONES.AUTH.TOKEN_AUSENTE);
      
      const payload = await this.jwtService.verifyAsync(token, { secret });
      (client as any).user = payload;
      this.logger.log(`Cliente autenticado y conectado a Sockets: ${client.id} (Rol: ${payload.rol})`);
    } catch (err) {
      this.logger.warn(`Cliente rechazado en Sockets (Sin token / Inválido): ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado de Sockets: ${client.id}`);
  }

  // El frontend llama a este evento para suscribirse a un viaje específico
  @SubscribeMessage('unirseAViaje')
  handleUnirseAViaje(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { viajeId: string },
  ) {
    const room = `viaje_${data.viajeId}`;
    client.join(room);
    this.logger.log(`Cliente ${client.id} se unió a la sala ${room}`);
  }

  // El conductor llama a este evento para recibir alertas directas
  @SubscribeMessage('identificarConductor')
  handleIdentificarConductor(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conductorId: string },
  ) {
    const room = `conductor_${data.conductorId}`;
    client.join(room);
    this.logger.log(`Conductor ${data.conductorId} (Socket ${client.id}) se unió a su sala privada ${room}`);
  }

  // El conductor llama a este evento cada segundo transmitiendo su lat/lng
  @SubscribeMessage('actualizarUbicacion')
  handleActualizarUbicacion(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { viajeId: string; lat: number; lng: number },
  ) {
    const room = `viaje_${data.viajeId}`;
    // Retransmite la ubicación a la sala (donde está el pasajero), excluyendo al conductor
    client.to(room).emit('ubicacionActualizada', {
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date().toISOString(),
    });
  }

  // ==========================================
  // Métodos expuestos para inyectar en Casos de Uso
  // ==========================================

  notificarNuevoViaje(viajeId: string, conductorId: string) {
    // Alerta SÓLO al conductor más cercano
    const room = `conductor_${conductorId}`;
    this.server.to(room).emit('nuevoViajeDisponible', { viajeId });
    this.logger.log(`Notificado viaje ${viajeId} al conductor ${conductorId}`);
  }

  notificarViajeAceptado(viajeId: string, conductorId: string) {
    // Alerta al pasajero que está en la sala del viaje
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('viajeAceptado', { viajeId, conductorId });
  }

  notificarConductorLlego(viajeId: string) {
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('conductorLlego', { viajeId });
  }

  notificarViajeCancelado(viajeId: string, actor: string, motivo: string | undefined) {
    const room = `viaje_${viajeId}`;
    this.server.to(room).emit('viajeCancelado', { viajeId, actor, motivo });
  }
}
