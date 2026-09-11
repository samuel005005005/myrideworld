import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICalificacionRepository } from '../../../dominio/repositorios/calificacion.repository.js';
import { Calificacion } from '../../../dominio/entidades/calificacion.entity.js';
import { CalificacionOrmEntity } from '../entidades/calificacion.orm-entity.js';

@Injectable()
export class CalificacionRepositoryImpl implements ICalificacionRepository {
  constructor(
    @InjectRepository(CalificacionOrmEntity)
    private readonly ormRepo: Repository<CalificacionOrmEntity>,
  ) {}

  async guardar(calificacion: Calificacion): Promise<Calificacion> {
    const entity = this.toOrm(calificacion);
    const guardado = await this.ormRepo.save(entity);
    return this.toDomain(guardado);
  }

  async existeCalificacion(viajeId: string): Promise<boolean> {
    return await this.ormRepo.exists({ where: { viajeId } });
  }

  private toDomain(entity: CalificacionOrmEntity): Calificacion {
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

  private toOrm(calificacion: Calificacion): CalificacionOrmEntity {
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
