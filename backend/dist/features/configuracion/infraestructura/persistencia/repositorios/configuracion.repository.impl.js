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
import { Configuracion } from '../../../dominio/entidades/configuracion.entity.js';
import { ConfiguracionOrmEntity } from '../entidades/configuracion.orm-entity.js';
import { ConfiguracionOrmMapper } from '../mappers/configuracion.orm-mapper.js';
import { MENSAJES } from '../../../../../compartidos/constantes/mensajes.const.js';
let ConfiguracionRepositoryImpl = class ConfiguracionRepositoryImpl {
    ormRepo;
    constructor(ormRepo) {
        this.ormRepo = ormRepo;
    }
    async obtenerValor(clave, defaultValue) {
        const entity = await this.ormRepo.findOne({ where: { clave } });
        if (entity) {
            return entity.valor;
        }
        const nuevaConfig = Configuracion.crear({
            clave,
            valor: defaultValue,
            descripcion: MENSAJES.INFRAESTRUCTURA.CONFIGURACION.VALOR_POR_DEFECTO(clave),
        });
        await this.guardar(nuevaConfig);
        return defaultValue;
    }
    async guardar(configuracion) {
        const entity = ConfiguracionOrmMapper.toOrm(configuracion);
        const saved = await this.ormRepo.save(entity);
        return ConfiguracionOrmMapper.toDomain(saved);
    }
};
ConfiguracionRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(ConfiguracionOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], ConfiguracionRepositoryImpl);
export { ConfiguracionRepositoryImpl };
//# sourceMappingURL=configuracion.repository.impl.js.map