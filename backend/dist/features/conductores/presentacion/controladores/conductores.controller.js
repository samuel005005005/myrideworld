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
let ConductoresController = class ConductoresController {
    crearConductor;
    constructor(crearConductor) {
        this.crearConductor = crearConductor;
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
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body(new ZodValidationPipe(crearConductorSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "crear", null);
ConductoresController = __decorate([
    Controller('api/conductores'),
    __metadata("design:paramtypes", [CrearConductorUseCase])
], ConductoresController);
export { ConductoresController };
//# sourceMappingURL=conductores.controller.js.map