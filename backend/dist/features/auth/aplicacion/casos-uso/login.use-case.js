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
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PASAJERO_REPOSITORY } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import * as bcrypt from 'bcrypt';
let LoginUseCase = class LoginUseCase {
    jwtService;
    pasajeroRepository;
    conductorRepository;
    constructor(jwtService, pasajeroRepository, conductorRepository) {
        this.jwtService = jwtService;
        this.pasajeroRepository = pasajeroRepository;
        this.conductorRepository = conductorRepository;
    }
    async ejecutar(dto) {
        let id;
        if (dto.rol === Roles.PASAJERO) {
            const pasajero = await this.pasajeroRepository.obtenerPorEmail(dto.email);
            if (!pasajero)
                throw new UnauthorizedException('Credenciales inválidas');
            const isMatch = await bcrypt.compare(dto.password, pasajero.passwordHash);
            if (!isMatch)
                throw new UnauthorizedException('Credenciales inválidas');
            id = pasajero.id;
        }
        else {
            const conductor = await this.conductorRepository.obtenerPorEmail(dto.email);
            if (!conductor)
                throw new UnauthorizedException('Credenciales inválidas');
            const isMatch = await bcrypt.compare(dto.password, conductor.passwordHash);
            if (!isMatch)
                throw new UnauthorizedException('Credenciales inválidas');
            id = conductor.id;
        }
        const payload = { sub: id, rol: dto.rol };
        const token = await this.jwtService.signAsync(payload);
        return { token };
    }
};
LoginUseCase = __decorate([
    Injectable(),
    __param(1, Inject(PASAJERO_REPOSITORY)),
    __param(2, Inject(CONDUCTOR_REPOSITORY)),
    __metadata("design:paramtypes", [JwtService, Object, Object])
], LoginUseCase);
export { LoginUseCase };
//# sourceMappingURL=login.use-case.js.map