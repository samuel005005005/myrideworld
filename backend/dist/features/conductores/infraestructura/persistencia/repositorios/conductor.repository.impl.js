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
import { ConductorOrmEntity } from '../entidades/conductor.orm-entity.js';
import { ConductorOrmMapper } from '../mappers/conductor.orm-mapper.js';
let ConductorRepositoryImpl = class ConductorRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async obtenerPorId(id) {
        const entity = await this.ormRepo.findOne({ where: { id } });
        return entity ? ConductorOrmMapper.toDomain(entity) : null;
    }
    async obtenerPorEmail(email) {
        const entity = await this.ormRepo.findOne({ where: { email } });
        return entity ? ConductorOrmMapper.toDomain(entity) : null;
    }
    async obtenerDisponibles() {
        const entities = await this.ormRepo.find({
            where: { estadoAprobacion: 'Aprobado', estadoDisponibilidad: 'Conectado' }
        });
        return entities.map(e => ConductorOrmMapper.toDomain(e));
    }
    async guardar(conductor) {
        const entity = ConductorOrmMapper.toOrm(conductor);
        const saved = await this.ormRepo.save(entity);
        return ConductorOrmMapper.toDomain(saved);
    }
    async listar(filtros) {
        const whereClause = filtros?.estadoAprobacion ? { estadoAprobacion: filtros.estadoAprobacion } : {};
        const entities = await this.ormRepo.find({ where: whereClause, order: { id: 'DESC' } });
        return entities.map(e => ConductorOrmMapper.toDomain(e));
    }
};
ConductorRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(ConductorOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], ConductorRepositoryImpl);
export { ConductorRepositoryImpl };
//# sourceMappingURL=conductor.repository.impl.js.map