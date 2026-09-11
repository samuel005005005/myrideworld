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
import { Viaje } from '../../../dominio/entidades/viaje.entity.js';
import { ViajeOrmEntity } from '../entidades/viaje.orm-entity.js';
let ViajeRepositoryImpl = class ViajeRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async obtenerPorId(id) {
        const entity = await this.ormRepo.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }
    async obtenerPorPasajero(pasajeroId) {
        const entities = await this.ormRepo.find({ where: { pasajeroId } });
        return entities.map(e => this.toDomain(e));
    }
    async obtenerPorConductor(conductorId) {
        const entities = await this.ormRepo.find({ where: { conductorId } });
        return entities.map(e => this.toDomain(e));
    }
    async guardar(viaje) {
        const entity = this.toOrm(viaje);
        const saved = await this.ormRepo.save(entity);
        return this.toDomain(saved);
    }
    toDomain(entity) {
        return Viaje.solicitar({
            id: entity.id,
            pasajeroId: entity.pasajeroId,
            conductorId: entity.conductorId ?? undefined,
            origenLat: entity.origenLat,
            origenLng: entity.origenLng,
            destinoLat: Number(entity.destinoLat),
            destinoLng: Number(entity.destinoLng),
            estado: entity.estado,
            tarifaEstimada: Number(entity.tarifaEstimada),
            metodoPago: entity.metodoPago ?? undefined,
            canceladoPor: entity.canceladoPor ?? undefined,
            motivoCancelacion: entity.motivoCancelacion ?? undefined,
            fechaSolicitud: entity.fechaSolicitud,
            fechaInicio: entity.fechaInicio ?? undefined,
            fechaFin: entity.fechaFin ?? undefined,
        });
    }
    toOrm(viaje) {
        return {
            id: viaje.id,
            pasajeroId: viaje.pasajeroId,
            conductorId: viaje.conductorId ?? undefined,
            origenLat: viaje.origenLat,
            origenLng: viaje.origenLng,
            destinoLat: viaje.destinoLat,
            destinoLng: viaje.destinoLng,
            estado: viaje.estado,
            tarifaEstimada: viaje.tarifaEstimada,
            metodoPago: viaje.metodoPago ?? undefined,
            canceladoPor: viaje.canceladoPor ?? undefined,
            motivoCancelacion: viaje.motivoCancelacion ?? undefined,
            fechaSolicitud: viaje.fechaSolicitud,
            fechaInicio: viaje.fechaInicio ?? undefined,
            fechaFin: viaje.fechaFin ?? undefined,
        };
    }
};
ViajeRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(ViajeOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], ViajeRepositoryImpl);
export { ViajeRepositoryImpl };
//# sourceMappingURL=viaje.repository.impl.js.map