import { Calificacion } from '../../../dominio/entidades/calificacion.entity.js';
import { CalificacionOrmEntity } from '../entidades/calificacion.orm-entity.js';

export class CalificacionOrmMapper {
  static toDomain(entity: CalificacionOrmEntity): Calificacion {
    return Calificacion.crear({
      id: entity.id,
      viajeId: entity.viajeId,
      pasajeroId: entity.pasajeroId,
      conductorId: entity.conductorId,
      puntuacion: entity.puntuacion,
      comentario: entity.comentario ?? undefined,
      fecha: entity.fecha,
    });
  }

  static toOrm(calificacion: Calificacion): CalificacionOrmEntity {
    return {
      id: calificacion.id,
      viajeId: calificacion.viajeId,
      pasajeroId: calificacion.pasajeroId,
      conductorId: calificacion.conductorId,
      puntuacion: calificacion.puntuacion,
      comentario: calificacion.comentario ?? undefined,
      fecha: calificacion.fecha,
    } as CalificacionOrmEntity;
  }
}
