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
import { PagoBalance } from '../../../dominio/entidades/pago-balance.entity.js';
import { PagoBalanceOrmEntity } from '../entidades/pago-balance.orm-entity.js';
let PagoBalanceRepositoryImpl = class PagoBalanceRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async obtenerPorId(id) {
        const entity = await this.ormRepo.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }
    async obtenerPorViaje(viajeId) {
        const entity = await this.ormRepo.findOne({ where: { viajeId } });
        return entity ? this.toDomain(entity) : null;
    }
    async obtenerPorConductor(conductorId) {
        const entities = await this.ormRepo.find({ where: { conductorId } });
        return entities.map(e => this.toDomain(e));
    }
    async guardar(pago) {
        const entity = this.toOrm(pago);
        const saved = await this.ormRepo.save(entity);
        return this.toDomain(saved);
    }
    toDomain(entity) {
        return PagoBalance.crear({
            id: entity.id,
            viajeId: entity.viajeId,
            conductorId: entity.conductorId,
            montoBruto: Number(entity.montoBruto),
            feeProcesamiento: Number(entity.feeProcesamiento),
            montoNeto: Number(entity.montoNeto),
            metodo: entity.metodo,
            fecha: entity.fecha,
        });
    }
    toOrm(pago) {
        return {
            id: pago.id,
            viajeId: pago.viajeId,
            conductorId: pago.conductorId,
            montoBruto: pago.montoBruto,
            feeProcesamiento: pago.feeProcesamiento,
            montoNeto: pago.montoNeto,
            metodo: pago.metodo,
        };
    }
};
PagoBalanceRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(PagoBalanceOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], PagoBalanceRepositoryImpl);
export { PagoBalanceRepositoryImpl };
//# sourceMappingURL=pago-balance.repository.impl.js.map