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
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasajeroOrmEntity } from '../entidades/pasajero.orm-entity.js';
import { PasajeroOrmMapper } from '../mappers/pasajero.orm-mapper.js';
let PasajeroRepositoryImpl = class PasajeroRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async obtenerPorId(id) {
        const entity = await this.ormRepo.findOne({ where: { id } });
        return entity ? PasajeroOrmMapper.toDomain(entity) : null;
    }
    async obtenerPorEmail(email) {
        const entity = await this.ormRepo.findOne({ where: { email } });
        return entity ? PasajeroOrmMapper.toDomain(entity) : null;
    }
    async guardar(pasajero) {
        const entity = PasajeroOrmMapper.toOrm(pasajero);
        const saved = await this.ormRepo.save(entity);
        return PasajeroOrmMapper.toDomain(saved);
    }
};
PasajeroRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(PasajeroOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], PasajeroRepositoryImpl);
export { PasajeroRepositoryImpl };
//# sourceMappingURL=pasajero.repository.impl.js.map