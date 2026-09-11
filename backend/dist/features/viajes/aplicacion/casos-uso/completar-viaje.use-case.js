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
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
let CompletarViajeUseCase = class CompletarViajeUseCase {
    viajeRepository;
    generarPago;
    constructor(viajeRepository, generarPago) {
        this.viajeRepository = viajeRepository;
        this.generarPago = generarPago;
    }
    async ejecutar(viajeId) {
        const viaje = await this.viajeRepository.obtenerPorId(viajeId);
        if (!viaje) {
            throw new Error('Viaje no encontrado.');
        }
        viaje.completarViaje();
        const guardado = await this.viajeRepository.guardar(viaje);
        if (viaje.conductorId) {
            await this.generarPago.ejecutar({
                viajeId: viaje.id,
                conductorId: viaje.conductorId,
                montoTotal: viaje.tarifaEstimada,
            });
        }
        return guardado;
    }
};
CompletarViajeUseCase = __decorate([
    Injectable(),
    __param(0, Inject(VIAJE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, GenerarPagoUseCase])
], CompletarViajeUseCase);
export { CompletarViajeUseCase };
//# sourceMappingURL=completar-viaje.use-case.js.map