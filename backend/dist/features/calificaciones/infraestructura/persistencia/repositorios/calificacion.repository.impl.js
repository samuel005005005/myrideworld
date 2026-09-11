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
import { Calificacion } from '../../../dominio/entidades/calificacion.entity.js';
import { CalificacionOrmEntity } from '../entidades/calificacion.orm-entity.js';
let CalificacionRepositoryImpl = class CalificacionRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async guardar(calificacion) {
        const entity = this.toOrm(calificacion);
        const guardado = await this.ormRepo.save(entity);
        return this.toDomain(guardado);
    }
    async existeCalificacion(viajeId) {
        return await this.ormRepo.exists({ where: { viajeId } });
    }
    toDomain(entity) {
        return Calificacion.crear({
            id: entity.id,
            viajeId: entity.viajeId,
            pasajeroId: entity.pasajeroId,
            conductorId: entity.conductorId,
            puntuacion: entity.puntuacion,
            comentario: entity.comentario ?? undefined,
            fecha: entity.fecha,
        });
    }
    toOrm(calificacion) {
        return {
            id: calificacion.id,
            viajeId: calificacion.viajeId,
            pasajeroId: calificacion.pasajeroId,
            conductorId: calificacion.conductorId,
            puntuacion: calificacion.puntuacion,
            comentario: calificacion.comentario ?? undefined,
            fecha: calificacion.fecha,
        };
    }
};
CalificacionRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(CalificacionOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], CalificacionRepositoryImpl);
export { CalificacionRepositoryImpl };
//# sourceMappingURL=calificacion.repository.impl.js.map