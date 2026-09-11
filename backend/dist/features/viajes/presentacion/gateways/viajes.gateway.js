var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ViajesGateway_1;
import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { WsJwtGuard } from '../../../../compartidos/middlewares/ws-jwt.guard.js';
let ViajesGateway = ViajesGateway_1 = class ViajesGateway {
    jwtService;
    configService;
    logger = new Logger(ViajesGateway_1.name);
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    server;
    async handleConnection(client) {
        try {
            const secret = this.configService.get('JWT_SECRET', 'super-secret-key');
            const token = client.handshake.auth?.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error(MENSAJES.EXCEPCIONES.AUTH.TOKEN_AUSENTE);
            const payload = await this.jwtService.verifyAsync(token, { secret });
            client.user = payload;
            this.logger.log(`Cliente autenticado y conectado a Sockets: ${client.id} (Rol: ${payload.rol})`);
        }
        catch (err) {
            this.logger.warn(`Cliente rechazado en Sockets (Sin token / Inválido): ${client.id}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Cliente desconectado de Sockets: ${client.id}`);
    }
    handleUnirseAViaje(client, data) {
        const room = `viaje_${data.viajeId}`;
        client.join(room);
        this.logger.log(`Cliente ${client.id} se unió a la sala ${room}`);
    }
    handleIdentificarConductor(client, data) {
        const room = `conductor_${data.conductorId}`;
        client.join(room);
        this.logger.log(`Conductor ${data.conductorId} (Socket ${client.id}) se unió a su sala privada ${room}`);
    }
    handleActualizarUbicacion(client, data) {
        const room = `viaje_${data.viajeId}`;
        client.to(room).emit('ubicacionActualizada', {
            lat: data.lat,
            lng: data.lng,
            timestamp: new Date().toISOString(),
        });
    }
    notificarNuevoViaje(viajeId, conductorId) {
        const room = `conductor_${conductorId}`;
        this.server.to(room).emit('nuevoViajeDisponible', { viajeId });
        this.logger.log(`Notificado viaje ${viajeId} al conductor ${conductorId}`);
    }
    notificarViajeAceptado(viajeId, conductorId) {
        const room = `viaje_${viajeId}`;
        this.server.to(room).emit('viajeAceptado', { viajeId, conductorId });
    }
    notificarConductorLlego(viajeId) {
        const room = `viaje_${viajeId}`;
        this.server.to(room).emit('conductorLlego', { viajeId });
    }
    notificarViajeCancelado(viajeId, actor, motivo) {
        const room = `viaje_${viajeId}`;
        this.server.to(room).emit('viajeCancelado', { viajeId, actor, motivo });
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], ViajesGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('unirseAViaje'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], ViajesGateway.prototype, "handleUnirseAViaje", null);
__decorate([
    SubscribeMessage('identificarConductor'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], ViajesGateway.prototype, "handleIdentificarConductor", null);
__decorate([
    SubscribeMessage('actualizarUbicacion'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], ViajesGateway.prototype, "handleActualizarUbicacion", null);
ViajesGateway = ViajesGateway_1 = __decorate([
    Injectable(),
    WebSocketGateway({
        cors: {
            origin: '*',
        },
    }),
    UseGuards(WsJwtGuard),
    __metadata("design:paramtypes", [JwtService,
        ConfigService])
], ViajesGateway);
export { ViajesGateway };
//# sourceMappingURL=viajes.gateway.js.map