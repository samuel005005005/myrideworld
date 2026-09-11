import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICalificacionRepository } from '../../dominio/repositorios/calificacion.repository.js';
import { CALIFICACION_REPOSITORY } from '../../dominio/repositorios/calificacion.repository.js';
import { Calificacion } from '../../dominio/entidades/calificacion.entity.js';
import { CalificarConductorDto } from '../dto/calificar-conductor.dto.js';
import { VIAJE_REPOSITORY } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import type { IViajeRepository } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class CalificarConductorUseCase {
  constructor(
    @Inject(CALIFICACION_REPOSITORY)
    private readonly calificacionRepository: ICalificacionRepository,
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
  ) {}

  async ejecutar(pasajeroId: string, dto: CalificarConductorDto): Promise<Calificacion> {
    const viaje = await this.viajeRepository.obtenerPorId(dto.viajeId);
    if (!viaje) {
      throw new NotFoundException(MENSAJES.EXCEPCIONES.CALIFICACIONES.NO_ENCONTRADO);
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
      conductorId: viaje.conductorId!,
      puntuacion: dto.puntuacion,
      comentario: dto.comentario,
    });

    return await this.calificacionRepository.guardar(calificacion);
  }
}
