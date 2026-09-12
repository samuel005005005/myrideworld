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
import { PASAJERO_REPOSITORY } from '../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { HASHEADOR_PASSWORD } from '../../../../compartidos/seguridad/hasheador-password.port.js';
let CrearPasajeroUseCase = class CrearPasajeroUseCase {
    pasajeroRepository;
    hasheadorPassword;
    constructor(pasajeroRepository, hasheadorPassword) {
        this.pasajeroRepository = pasajeroRepository;
        this.hasheadorPassword = hasheadorPassword;
    }
    async ejecutar(dto) {
        const existeEmail = await this.pasajeroRepository.obtenerPorEmail(dto.email);
        if (existeEmail) {
            throw new DomainException(MENSAJES.EXCEPCIONES.PASAJEROS.EMAIL_REGISTRADO);
        }
        const passwordHash = await this.hasheadorPassword.hashear(dto.password ?? '123456');
        const pasajero = Pasajero.crear({
            nombreCompleto: dto.nombreCompleto,
            email: dto.email,
            telefono: dto.telefono,
            passwordHash: passwordHash,
        });
        return await this.pasajeroRepository.guardar(pasajero);
    }
};
CrearPasajeroUseCase = __decorate([
    Injectable(),
    __param(0, Inject(PASAJERO_REPOSITORY)),
    __param(1, Inject(HASHEADOR_PASSWORD)),
    __metadata("design:paramtypes", [Object, Object])
], CrearPasajeroUseCase);
export { CrearPasajeroUseCase };
//# sourceMappingURL=crear-pasajero.use-case.js.map