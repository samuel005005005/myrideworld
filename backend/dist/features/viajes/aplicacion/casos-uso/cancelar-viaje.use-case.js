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
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
let CancelarViajeUseCase = class CancelarViajeUseCase {
    viajeRepository;
    viajesGateway;
    constructor(viajeRepository, viajesGateway) {
        this.viajeRepository = viajeRepository;
        this.viajesGateway = viajesGateway;
    }
    async ejecutar(viajeId, actorId, rol, motivo) {
        const viaje = await this.viajeRepository.obtenerPorId(viajeId);
        if (!viaje) {
            throw new NotFoundException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
        }
        if (rol === Roles.PASAJERO && viaje.pasajeroId !== actorId) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.CANCELACION_NO_SOLICITADO);
        }
        if (rol === Roles.CONDUCTOR && viaje.conductorId !== actorId) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.CANCELACION_NO_ASIGNADO);
        }
        viaje.cancelar(rol, motivo);
        const guardado = await this.viajeRepository.guardar(viaje);
        this.viajesGateway.notificarViajeCancelado(guardado.id, rol, motivo);
        return guardado;
    }
};
CancelarViajeUseCase = __decorate([
    Injectable(),
    __param(0, Inject(VIAJE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, ViajesGateway])
], CancelarViajeUseCase);
export { CancelarViajeUseCase };
//# sourceMappingURL=cancelar-viaje.use-case.js.map