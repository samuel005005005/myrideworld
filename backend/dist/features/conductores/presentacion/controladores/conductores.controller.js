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
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import { crearConductorSchema } from '../../aplicacion/dto/crear-conductor.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { UseGuards, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { AprobarConductorUseCase } from '../../aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { ListarConductoresUseCase } from '../../aplicacion/casos-uso/listar-conductores.use-case.js';
let ConductoresController = class ConductoresController {
    crearConductor;
    aprobarConductor;
    listarConductores;
    constructor(crearConductor, aprobarConductor, listarConductores) {
        this.crearConductor = crearConductor;
        this.aprobarConductor = aprobarConductor;
        this.listarConductores = listarConductores;
    }
    async crear(dto) {
        const conductor = await this.crearConductor.ejecutar(dto);
        return {
            id: conductor.id,
            nombreCompleto: conductor.nombreCompleto,
            email: conductor.email,
            telefono: conductor.telefono,
            estadoAprobacion: conductor.estadoAprobacion,
            estadoDisponibilidad: conductor.estadoDisponibilidad,
            vehiculo: {
                marca: conductor.vehiculoMarca,
                modelo: conductor.vehiculoModelo,
                color: conductor.vehiculoColor,
                placa: conductor.vehiculoPlaca,
            }
        };
    }
    async listar(estado) {
        const conductores = await this.listarConductores.ejecutar({ estadoAprobacion: estado });
        return conductores.map(c => ({
            id: c.id,
            nombreCompleto: c.nombreCompleto,
            email: c.email,
            telefono: c.telefono,
            estadoAprobacion: c.estadoAprobacion,
            estadoDisponibilidad: c.estadoDisponibilidad,
        }));
    }
    async aprobar(id) {
        const conductor = await this.aprobarConductor.ejecutar(id);
        return {
            id: conductor.id,
            estadoAprobacion: conductor.estadoAprobacion,
            estadoDisponibilidad: conductor.estadoDisponibilidad,
        };
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body(new ZodValidationPipe(crearConductorSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "crear", null);
__decorate([
    Get(),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.ADMIN),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar conductores (Solo Admin)' }),
    ApiQuery({ name: 'estado', required: false, enum: EstadosConductor }),
    __param(0, Query('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "listar", null);
__decorate([
    Patch(':id/aprobar'),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.ADMIN),
    ApiBearerAuth(),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Aprobar un conductor pendiente (Solo Admin)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "aprobar", null);
ConductoresController = __decorate([
    ApiTags('Conductores'),
    Controller('api/conductores'),
    __metadata("design:paramtypes", [CrearConductorUseCase,
        AprobarConductorUseCase,
        ListarConductoresUseCase])
], ConductoresController);
export { ConductoresController };
//# sourceMappingURL=conductores.controller.js.map