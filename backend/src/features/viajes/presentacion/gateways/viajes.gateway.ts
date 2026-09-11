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
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ViajesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ViajesGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado a Sockets: ${client.id}`);
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

  notificarNuevoViaje(viajeId: string) {
    // Alerta a los conductores conectados (broadcast general para el MVP)
    this.server.emit('nuevoViajeDisponible', { viajeId });
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
