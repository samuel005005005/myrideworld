import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { INotificadorViaje } from '../../aplicacion/puertos/notificador-viaje.port.js';
import type { ViajeDisponibleNotificacion } from '../../aplicacion/puertos/viaje-disponible-notificacion.js';
export declare class ViajesGateway implements OnGatewayConnection, OnGatewayDisconnect, INotificadorViaje {
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
    notificarNuevoViaje(conductorId: string, viaje: ViajeDisponibleNotificacion): void;
    notificarViajeAceptado(viajeId: string, conductorId: string): void;
    notificarConductorLlego(viajeId: string): void;
    notificarViajeCancelado(viajeId: string, actor: string, motivo: string | undefined): void;
    notificarViajeIniciado(viajeId: string): void;
    notificarViajeCompletado(viajeId: string, tarifaEstimada: number): void;
}
