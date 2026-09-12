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
import { Injectable, Inject } from '@nestjs/common';
import { CALIFICACION_REPOSITORY } from '../../dominio/repositorios/calificacion.repository.js';
import { Calificacion } from '../../dominio/entidades/calificacion.entity.js';
import { VIAJE_REPOSITORY } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
let CalificarConductorUseCase = class CalificarConductorUseCase {
    calificacionRepository;
    viajeRepository;
    constructor(calificacionRepository, viajeRepository) {
        this.calificacionRepository = calificacionRepository;
        this.viajeRepository = viajeRepository;
    }
    async ejecutar(pasajeroId, dto) {
        const viaje = await this.viajeRepository.obtenerPorId(dto.viajeId);
        if (!viaje) {
            throw new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.NO_ENCONTRADO, 404);
        }
        if (viaje.pasajeroId !== pasajeroId) {
            throw new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.SOLO_PASAJERO_CALIFICA);
        }
        if (viaje.estado !== EstadosViaje.COMPLETADO) {
            throw new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.SOLO_COMPLETADOS);
        }
        const existeCalificacion = await this.calificacionRepository.existeCalificacion(dto.viajeId);
        if (existeCalificacion) {
            throw new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.YA_CALIFICADO);
        }
        const calificacion = Calificacion.crear({
            viajeId: viaje.id,
            pasajeroId: pasajeroId,
            conductorId: viaje.conductorId,
            puntuacion: dto.puntuacion,
            comentario: dto.comentario,
        });
        return await this.calificacionRepository.guardar(calificacion);
    }
};
CalificarConductorUseCase = __decorate([
    Injectable(),
    __param(0, Inject(CALIFICACION_REPOSITORY)),
    __param(1, Inject(VIAJE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], CalificarConductorUseCase);
export { CalificarConductorUseCase };
//# sourceMappingURL=calificar-conductor.use-case.js.map