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
import { Conductor } from '../../../dominio/entidades/conductor.entity.js';
import { ConductorOrmEntity } from '../entidades/conductor.orm-entity.js';
let ConductorRepositoryImpl = class ConductorRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async obtenerPorId(id) {
        const entity = await this.ormRepo.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }
    async obtenerPorEmail(email) {
        const entity = await this.ormRepo.findOne({ where: { email } });
        return entity ? this.toDomain(entity) : null;
    }
    async obtenerDisponibles() {
        const entities = await this.ormRepo.find({
            where: { estadoAprobacion: 'Aprobado', estadoDisponibilidad: 'Conectado' }
        });
        return entities.map(e => this.toDomain(e));
    }
    async guardar(conductor) {
        const entity = this.toOrm(conductor);
        const saved = await this.ormRepo.save(entity);
        return this.toDomain(saved);
    }
    async listar(filtros) {
        const whereClause = filtros?.estadoAprobacion ? { estadoAprobacion: filtros.estadoAprobacion } : {};
        const entities = await this.ormRepo.find({ where: whereClause, order: { id: 'DESC' } });
        return entities.map(e => this.toDomain(e));
    }
    toDomain(entity) {
        return Conductor.crear({
            id: entity.id,
            nombreCompleto: entity.nombreCompleto,
            email: entity.email,
            telefono: entity.telefono,
            passwordHash: entity.passwordHash,
            fotoUrl: entity.fotoUrl ?? undefined,
            vehiculoMarca: entity.vehiculoMarca,
            vehiculoModelo: entity.vehiculoModelo,
            vehiculoColor: entity.vehiculoColor,
            vehiculoPlaca: entity.vehiculoPlaca,
            estadoAprobacion: entity.estadoAprobacion,
            estadoDisponibilidad: entity.estadoDisponibilidad,
            ultimaUbicacionLat: entity.ultimaUbicacionLat ? Number(entity.ultimaUbicacionLat) : undefined,
            ultimaUbicacionLng: entity.ultimaUbicacionLng ?? undefined,
        });
    }
    toOrm(conductor) {
        return {
            id: conductor.id,
            nombreCompleto: conductor.nombreCompleto,
            email: conductor.email,
            telefono: conductor.telefono,
            passwordHash: conductor.passwordHash,
            fotoUrl: conductor.fotoUrl ?? undefined,
            vehiculoMarca: conductor.vehiculoMarca,
            vehiculoModelo: conductor.vehiculoModelo,
            vehiculoColor: conductor.vehiculoColor,
            vehiculoPlaca: conductor.vehiculoPlaca,
            estadoAprobacion: conductor.estadoAprobacion,
            estadoDisponibilidad: conductor.estadoDisponibilidad,
            ultimaUbicacionLat: conductor.ultimaUbicacionLat ?? undefined,
            ultimaUbicacionLng: conductor.ultimaUbicacionLng ?? undefined,
        };
    }
};
ConductorRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(ConductorOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], ConductorRepositoryImpl);
export { ConductorRepositoryImpl };
//# sourceMappingURL=conductor.repository.impl.js.map