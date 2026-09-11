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
import { ViajeOrmEntity } from '../entidades/viaje.orm-entity.js';
import { ViajeOrmMapper } from '../mappers/viaje.orm-mapper.js';
import { EstadosViaje } from '../../../../../compartidos/constantes/estados-viaje.enum.js';
let ViajeRepositoryImpl = class ViajeRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async obtenerPorId(id) {
        const entity = await this.ormRepo.findOne({
            where: { id },
            relations: { pasajero: true, conductor: true },
        });
        return entity ? ViajeOrmMapper.toDomain(entity) : null;
    }
    async obtenerPorPasajero(pasajeroId) {
        const entities = await this.ormRepo.find({
            where: { pasajeroId },
            relations: { conductor: true },
            order: { fechaSolicitud: 'DESC' },
        });
        return entities.map(e => ViajeOrmMapper.toDomain(e));
    }
    async obtenerPorConductor(conductorId) {
        const entities = await this.ormRepo.find({
            where: { conductorId },
            relations: { pasajero: true },
            order: { fechaSolicitud: 'DESC' },
        });
        return entities.map(e => ViajeOrmMapper.toDomain(e));
    }
    async guardar(viaje) {
        const entity = ViajeOrmMapper.toOrm(viaje);
        const saved = await this.ormRepo.save(entity);
        return ViajeOrmMapper.toDomain(saved);
    }
    async listar(filtros) {
        const where = {};
        if (filtros?.pasajeroId)
            where.pasajeroId = filtros.pasajeroId;
        if (filtros?.conductorId)
            where.conductorId = filtros.conductorId;
        const entities = await this.ormRepo.find({ where });
        return entities.map(e => ViajeOrmMapper.toDomain(e));
    }
    async obtenerViajesVencidos(minutos) {
        const fechaLimite = new Date(Date.now() - minutos * 60000);
        const entities = await this.ormRepo
            .createQueryBuilder('viaje')
            .where('viaje.estado = :estado', { estado: EstadosViaje.SOLICITADO })
            .andWhere('viaje.fechaSolicitud <= :fechaLimite', { fechaLimite })
            .getMany();
        return entities.map(e => ViajeOrmMapper.toDomain(e));
    }
};
ViajeRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(ViajeOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], ViajeRepositoryImpl);
export { ViajeRepositoryImpl };
//# sourceMappingURL=viaje.repository.impl.js.map