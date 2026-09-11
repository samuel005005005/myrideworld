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
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { EstimarTarifaUseCase } from '../../../tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';
let SolicitarViajeUseCase = class SolicitarViajeUseCase {
    viajeRepository;
    conductorRepository;
    estimarTarifa;
    viajesGateway;
    constructor(viajeRepository, conductorRepository, estimarTarifa, viajesGateway) {
        this.viajeRepository = viajeRepository;
        this.conductorRepository = conductorRepository;
        this.estimarTarifa = estimarTarifa;
        this.viajesGateway = viajesGateway;
    }
    async ejecutar(dto) {
        const tarifa = await this.estimarTarifa.ejecutar({
            origenLat: dto.origenLat,
            origenLng: dto.origenLng,
            destinoLat: dto.destinoLat,
            destinoLng: dto.destinoLng,
        });
        const viaje = Viaje.solicitar({
            pasajeroId: dto.pasajeroId,
            origenLat: dto.origenLat,
            origenLng: dto.origenLng,
            destinoLat: dto.destinoLat,
            destinoLng: dto.destinoLng,
            tarifaEstimada: tarifa.precio,
        });
        const guardado = await this.viajeRepository.guardar(viaje);
        const conductores = await this.conductorRepository.obtenerDisponibles();
        let conductorSugerido = null;
        let minimaDistancia = Infinity;
        for (const c of conductores) {
            if (guardado.conductoresRechazados.includes(c.id))
                continue;
            if (c.ultimaUbicacionLat === null || c.ultimaUbicacionLng === null)
                continue;
            const distancia = calcularDistanciaKm(guardado.origenLat, guardado.origenLng, c.ultimaUbicacionLat, c.ultimaUbicacionLng);
            if (distancia < minimaDistancia) {
                minimaDistancia = distancia;
                conductorSugerido = c;
            }
        }
        if (conductorSugerido) {
            this.viajesGateway.notificarNuevoViaje(guardado.id, conductorSugerido.id);
        }
        else {
        }
        return guardado;
    }
};
SolicitarViajeUseCase = __decorate([
    Injectable(),
    __param(0, Inject(VIAJE_REPOSITORY)),
    __param(1, Inject(CONDUCTOR_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, EstimarTarifaUseCase,
        ViajesGateway])
], SolicitarViajeUseCase);
export { SolicitarViajeUseCase };
//# sourceMappingURL=solicitar-viaje.use-case.js.map