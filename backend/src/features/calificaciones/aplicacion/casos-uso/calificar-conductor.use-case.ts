import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICalificacionRepository, CALIFICACION_REPOSITORY } from '../../dominio/repositorios/calificacion.repository.js';
import { Calificacion } from '../../dominio/entidades/calificacion.entity.js';
import { CalificarConductorDto } from '../dto/calificar-conductor.dto.js';
import { VIAJE_REPOSITORY } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { IViajeRepository } from '../../../viajes/dominio/repositorios/viaje.repository.js';

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
      throw new NotFoundException('Viaje no encontrado');
    }

    if (viaje.pasajeroId !== pasajeroId) {
      throw new Error('Solo el pasajero del viaje puede calificar al conductor.');
    }

    if (viaje.estado !== 'Completado') {
      throw new Error('Solo se pueden calificar viajes completados.');
    }

    const yaCalificado = await this.calificacionRepository.existeCalificacion(viaje.id);
    if (yaCalificado) {
      throw new Error('Este viaje ya fue calificado.');
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
