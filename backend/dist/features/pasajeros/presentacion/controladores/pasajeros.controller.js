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
import { CrearPasajeroUseCase } from '../../aplicacion/casos-uso/crear-pasajero.use-case.js';
import { crearPasajeroSchema } from '../../aplicacion/dto/crear-pasajero.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
let PasajerosController = class PasajerosController {
    crearPasajero;
    constructor(crearPasajero) {
        this.crearPasajero = crearPasajero;
    }
    async crear(dto) {
        const pasajero = await this.crearPasajero.ejecutar(dto);
        return {
            id: pasajero.id,
            nombreCompleto: pasajero.nombreCompleto,
            email: pasajero.email,
            telefono: pasajero.telefono,
            estado: pasajero.estado,
            fechaRegistro: pasajero.fechaRegistro,
        };
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body(new ZodValidationPipe(crearPasajeroSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PasajerosController.prototype, "crear", null);
PasajerosController = __decorate([
    Controller('api/pasajeros'),
    __metadata("design:paramtypes", [CrearPasajeroUseCase])
], PasajerosController);
export { PasajerosController };
//# sourceMappingURL=pasajeros.controller.js.map