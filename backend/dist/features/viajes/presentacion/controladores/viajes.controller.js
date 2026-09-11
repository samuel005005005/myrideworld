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
import { Controller, Post, Param, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { Roles } from '../../../../compartidos/decoradores/roles.decorator.js';
import { SolicitarViajeUseCase } from '../../aplicacion/casos-uso/solicitar-viaje.use-case.js';
import { SolicitarViajeDto } from '../../aplicacion/dto/solicitar-viaje.dto.js';
import { AceptarViajeUseCase } from '../../aplicacion/casos-uso/aceptar-viaje.use-case.js';
import { MarcarLlegadaUseCase } from '../../aplicacion/casos-uso/marcar-llegada.use-case.js';
import { IniciarViajeUseCase } from '../../aplicacion/casos-uso/iniciar-viaje.use-case.js';
import { CompletarViajeUseCase } from '../../aplicacion/casos-uso/completar-viaje.use-case.js';
import { CancelarViajeUseCase } from '../../aplicacion/casos-uso/cancelar-viaje.use-case.js';
import { AceptarViajeDto } from '../../aplicacion/dto/aceptar-viaje.dto.js';
import { CancelarViajeDto } from '../../aplicacion/dto/cancelar-viaje.dto.js';
import { Roles as RolesEnum } from '../../../../compartidos/constantes/roles.enum.js';
let ViajesController = class ViajesController {
    solicitarViaje;
    aceptarViaje;
    marcarLlegada;
    iniciarViaje;
    completarViaje;
    cancelarViaje;
    constructor(solicitarViaje, aceptarViaje, marcarLlegada, iniciarViaje, completarViaje, cancelarViaje) {
        this.solicitarViaje = solicitarViaje;
        this.aceptarViaje = aceptarViaje;
        this.marcarLlegada = marcarLlegada;
        this.iniciarViaje = iniciarViaje;
        this.completarViaje = completarViaje;
        this.cancelarViaje = cancelarViaje;
    }
    async solicitar(dto, req) {
        return await this.solicitarViaje.ejecutar(dto);
    }
    async aceptar(id, dto, req) {
        dto.conductorId = req.user.sub;
        return await this.aceptarViaje.ejecutar(id, dto);
    }
    async llegada(id, req) {
        const conductorId = req.user.sub;
        return await this.marcarLlegada.ejecutar(id, conductorId);
    }
    async iniciar(id) {
        return await this.iniciarViaje.ejecutar(id);
    }
    async completar(id) {
        return await this.completarViaje.ejecutar(id);
    }
    async cancelar(id, dto, req) {
        const actorId = req.user.sub;
        const rol = req.user.rol;
        return await this.cancelarViaje.ejecutar(id, actorId, rol, dto.motivo);
    }
};
__decorate([
    Post(),
    UseGuards(AuthGuard, RolesGuard),
    Roles(RolesEnum.PASAJERO),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Solicitar un nuevo viaje (Solo Pasajeros)' }),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SolicitarViajeDto, Object]),
    __metadata("design:returntype", Promise)
], ViajesController.prototype, "solicitar", null);
__decorate([
    Post(':id/aceptar'),
    UseGuards(AuthGuard, RolesGuard),
    Roles(RolesEnum.CONDUCTOR),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Aceptar un viaje disponible (Solo Conductores)' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AceptarViajeDto, Object]),
    __metadata("design:returntype", Promise)
], ViajesController.prototype, "aceptar", null);
__decorate([
    Post(':id/llegada'),
    UseGuards(AuthGuard, RolesGuard),
    Roles(RolesEnum.CONDUCTOR),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Notificar que el conductor ha llegado al punto de recogida' }),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ViajesController.prototype, "llegada", null);
__decorate([
    Post(':id/iniciar'),
    UseGuards(AuthGuard, RolesGuard),
    Roles(RolesEnum.CONDUCTOR),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Iniciar un viaje (Solo Conductores)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViajesController.prototype, "iniciar", null);
__decorate([
    Post(':id/completar'),
    UseGuards(AuthGuard, RolesGuard),
    Roles(RolesEnum.CONDUCTOR),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Completar el viaje y generar cobro (Solo Conductores)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViajesController.prototype, "completar", null);
__decorate([
    Post(':id/cancelar'),
    UseGuards(AuthGuard, RolesGuard),
    Roles(RolesEnum.PASAJERO, RolesEnum.CONDUCTOR),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Cancelar un viaje' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CancelarViajeDto, Object]),
    __metadata("design:returntype", Promise)
], ViajesController.prototype, "cancelar", null);
ViajesController = __decorate([
    ApiTags('Viajes'),
    ApiBearerAuth(),
    Controller('api/viajes'),
    __metadata("design:paramtypes", [SolicitarViajeUseCase,
        AceptarViajeUseCase,
        MarcarLlegadaUseCase,
        IniciarViajeUseCase,
        CompletarViajeUseCase,
        CancelarViajeUseCase])
], ViajesController);
export { ViajesController };
//# sourceMappingURL=viajes.controller.js.map