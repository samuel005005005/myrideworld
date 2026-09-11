import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class ViajesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(jwtService: JwtService, configService: ConfigService);
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleUnirseAViaje(client: Socket, data: {
        viajeId: string;
    }): void;
    handleIdentificarConductor(client: Socket, data: {
        conductorId: string;
    }): void;
    handleActualizarUbicacion(client: Socket, data: {
        viajeId: string;
        lat: number;
        lng: number;
    }): void;
    notificarNuevoViaje(viajeId: string, conductorId: string): void;
    notificarViajeAceptado(viajeId: string, conductorId: string): void;
    notificarConductorLlego(viajeId: string): void;
    notificarViajeCancelado(viajeId: string, actor: string, motivo: string | undefined): void;
}
