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
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PASAJERO_REPOSITORY } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { HASHEADOR_PASSWORD } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import { GENERADOR_TOKEN } from '../puertos/generador-token.port.js';
const E = MENSAJES.EXCEPCIONES.AUTH;
let LoginUseCase = class LoginUseCase {
    generadorToken;
    configService;
    pasajeroRepository;
    conductorRepository;
    hasheadorPassword;
    constructor(generadorToken, configService, pasajeroRepository, conductorRepository, hasheadorPassword) {
        this.generadorToken = generadorToken;
        this.configService = configService;
        this.pasajeroRepository = pasajeroRepository;
        this.conductorRepository = conductorRepository;
        this.hasheadorPassword = hasheadorPassword;
    }
    async ejecutar(dto) {
        let id;
        if (dto.rol === Roles.PASAJERO) {
            const pasajero = await this.pasajeroRepository.obtenerPorEmail(dto.email);
            if (!pasajero) {
                throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
            }
            const isMatch = await this.hasheadorPassword.comparar(dto.password, pasajero.passwordHash);
            if (!isMatch) {
                throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
            }
            id = pasajero.id;
        }
        else if (dto.rol === Roles.CONDUCTOR) {
            const conductor = await this.conductorRepository.obtenerPorEmail(dto.email);
            if (!conductor) {
                throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
            }
            const isMatch = await this.hasheadorPassword.comparar(dto.password, conductor.passwordHash);
            if (!isMatch) {
                throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
            }
            id = conductor.id;
        }
        else if (dto.rol === Roles.ADMIN) {
            const adminEmail = this.configService.get('ADMIN_EMAIL') || 'admin@myride.com';
            const adminPassword = this.configService.get('ADMIN_PASSWORD') || 'admin123';
            if (dto.email !== adminEmail || dto.password !== adminPassword) {
                throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
            }
            id = 'admin-1';
        }
        else {
            throw new DomainException(E.ROL_INVALIDO, 401);
        }
        const token = await this.generadorToken.firmar({ sub: id, rol: dto.rol });
        return { token };
    }
};
LoginUseCase = __decorate([
    Injectable(),
    __param(0, Inject(GENERADOR_TOKEN)),
    __param(2, Inject(PASAJERO_REPOSITORY)),
    __param(3, Inject(CONDUCTOR_REPOSITORY)),
    __param(4, Inject(HASHEADOR_PASSWORD)),
    __metadata("design:paramtypes", [Object, ConfigService, Object, Object, Object])
], LoginUseCase);
export { LoginUseCase };
//# sourceMappingURL=login.use-case.js.map