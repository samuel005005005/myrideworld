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
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
let AceptarViajeUseCase = class AceptarViajeUseCase {
    viajeRepository;
    notificadorViaje;
    constructor(viajeRepository, notificadorViaje) {
        this.viajeRepository = viajeRepository;
        this.notificadorViaje = notificadorViaje;
    }
    async ejecutar(viajeId, dto) {
        const viaje = await this.viajeRepository.obtenerPorId(viajeId);
        if (!viaje) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
        }
        viaje.asignarConductor(dto.conductorId);
        const guardado = await this.viajeRepository.guardar(viaje);
        this.notificadorViaje.notificarViajeAceptado(guardado.id, dto.conductorId);
        return guardado;
    }
};
AceptarViajeUseCase = __decorate([
    Injectable(),
    __param(0, Inject(VIAJE_REPOSITORY)),
    __param(1, Inject(NOTIFICADOR_VIAJE)),
    __metadata("design:paramtypes", [Object, Object])
], AceptarViajeUseCase);
export { AceptarViajeUseCase };
//# sourceMappingURL=aceptar-viaje.use-case.js.map