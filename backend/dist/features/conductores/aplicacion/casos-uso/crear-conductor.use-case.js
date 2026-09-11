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
import { Inject, Injectable } from '@nestjs/common';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import * as bcrypt from 'bcrypt';
let CrearConductorUseCase = class CrearConductorUseCase {
    conductorRepository;
    constructor(conductorRepository) {
        this.conductorRepository = conductorRepository;
    }
    async ejecutar(dto) {
        const conductorExistente = await this.conductorRepository.obtenerPorEmail(dto.email);
        if (conductorExistente) {
            throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.EMAIL_REGISTRADO);
        }
        const passwordHash = await bcrypt.hash(dto.password ?? '123456', 10);
        const conductor = Conductor.crear({
            nombreCompleto: dto.nombreCompleto,
            email: dto.email,
            telefono: dto.telefono,
            vehiculoMarca: dto.vehiculoMarca,
            vehiculoModelo: dto.vehiculoModelo,
            vehiculoColor: dto.vehiculoColor,
            vehiculoPlaca: dto.vehiculoPlaca,
            passwordHash,
        });
        return await this.conductorRepository.guardar(conductor);
    }
};
CrearConductorUseCase = __decorate([
    Injectable(),
    __param(0, Inject(CONDUCTOR_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CrearConductorUseCase);
export { CrearConductorUseCase };
//# sourceMappingURL=crear-conductor.use-case.js.map