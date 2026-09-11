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
import { Controller, Post, Body, HttpCode, HttpStatus, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CrearPasajeroUseCase } from '../../aplicacion/casos-uso/crear-pasajero.use-case.js';
import { ObtenerPasajeroUseCase } from '../../aplicacion/casos-uso/obtener-pasajero.use-case.js';
import { ActualizarPasajeroUseCase } from '../../aplicacion/casos-uso/actualizar-pasajero.use-case.js';
import { crearPasajeroSchema } from '../../aplicacion/dto/crear-pasajero.dto.js';
import { CrearPasajeroDto } from '../../aplicacion/dto/crear-pasajero.dto.js';
import { actualizarPasajeroSchema, ActualizarPasajeroDto } from '../../aplicacion/dto/actualizar-pasajero.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { PasajeroMapper } from '../../aplicacion/mappers/pasajero.mapper.js';
import { PasajeroResponseDto } from '../../aplicacion/dto/pasajero-response.dto.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
const H = MENSAJES.HTTP.RESPUESTAS;
let PasajerosController = class PasajerosController {
    crearPasajero;
    obtenerPasajero;
    actualizarPasajero;
    constructor(crearPasajero, obtenerPasajero, actualizarPasajero) {
        this.crearPasajero = crearPasajero;
        this.obtenerPasajero = obtenerPasajero;
        this.actualizarPasajero = actualizarPasajero;
    }
    async crear(dto) {
        const pasajero = await this.crearPasajero.ejecutar(dto);
        return PasajeroMapper.toResponse(pasajero);
    }
    async obtenerPerfil(req) {
        const pasajero = await this.obtenerPasajero.ejecutar(req.user.sub);
        return PasajeroMapper.toResponse(pasajero);
    }
    async actualizarPerfil(req, dto) {
        const pasajero = await this.actualizarPasajero.ejecutar(req.user.sub, dto);
        return PasajeroMapper.toResponse(pasajero);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Registrar un nuevo pasajero' }),
    ApiResponse({ status: 201, description: H.CREADO_OK, type: PasajeroResponseDto }),
    ApiResponse({ status: 400, description: H.DATOS_INVALIDOS }),
    __param(0, Body(new ZodValidationPipe(crearPasajeroSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CrearPasajeroDto]),
    __metadata("design:returntype", Promise)
], PasajerosController.prototype, "crear", null);
__decorate([
    Get('me'),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.PASAJERO),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Obtener perfil del pasajero autenticado' }),
    ApiResponse({ status: 200, type: PasajeroResponseDto }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PasajerosController.prototype, "obtenerPerfil", null);
__decorate([
    Patch('me'),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.PASAJERO),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Actualizar perfil del pasajero autenticado' }),
    ApiResponse({ status: 200, type: PasajeroResponseDto }),
    __param(0, Req()),
    __param(1, Body(new ZodValidationPipe(actualizarPasajeroSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ActualizarPasajeroDto]),
    __metadata("design:returntype", Promise)
], PasajerosController.prototype, "actualizarPerfil", null);
PasajerosController = __decorate([
    ApiTags('Pasajeros'),
    Controller('api/pasajeros'),
    __metadata("design:paramtypes", [CrearPasajeroUseCase,
        ObtenerPasajeroUseCase,
        ActualizarPasajeroUseCase])
], PasajerosController);
export { PasajerosController };
//# sourceMappingURL=pasajeros.controller.js.map