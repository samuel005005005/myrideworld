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
import { Inject, Injectable } from '@nestjs/common';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
let EstimarTarifaUseCase = class EstimarTarifaUseCase {
    tarifaRepository;
    configRepo;
    constructor(tarifaRepository, configRepo) {
        this.tarifaRepository = tarifaRepository;
        this.configRepo = configRepo;
    }
    async ejecutar(dto) {
        const deltaLat = dto.destinoLat - dto.origenLat;
        const deltaLng = dto.destinoLng - dto.origenLng;
        const distancia = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) * 111;
        const tarifaBase = Number(await this.configRepo.obtenerValor('TARIFA_BASE', '30.0'));
        const precioPorKm = Number(await this.configRepo.obtenerValor('TARIFA_KM', '15.0'));
        const tarifaMinima = Number(await this.configRepo.obtenerValor('TARIFA_MINIMA', '50.0'));
        let precio = tarifaBase + (distancia * precioPorKm);
        precio = Math.max(precio, tarifaMinima);
        precio = Math.round(precio * 100) / 100;
        const tarifa = Tarifa.crear({
            origen: `${dto.origenLat},${dto.origenLng}`,
            destino: `${dto.destinoLat},${dto.destinoLng}`,
            precio: precio,
        });
        return await this.tarifaRepository.guardar(tarifa);
    }
};
EstimarTarifaUseCase = __decorate([
    Injectable(),
    __param(0, Inject(TARIFA_REPOSITORY)),
    __param(1, Inject(CONFIGURACION_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], EstimarTarifaUseCase);
export { EstimarTarifaUseCase };
//# sourceMappingURL=estimar-tarifa.use-case.js.map