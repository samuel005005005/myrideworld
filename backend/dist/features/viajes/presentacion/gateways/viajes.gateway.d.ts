import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ViajesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger;
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleUnirseAViaje(client: Socket, data: {
        viajeId: string;
    }): void;
    handleActualizarUbicacion(client: Socket, data: {
        viajeId: string;
        lat: number;
        lng: number;
    }): void;
    notificarNuevoViaje(viajeId: string): void;
    notificarViajeAceptado(viajeId: string, conductorId: string): void;
    notificarConductorLlego(viajeId: string): void;
    notificarViajeCancelado(viajeId: string, actor: string, motivo: string | undefined): void;
}
