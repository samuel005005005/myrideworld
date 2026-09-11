import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICalificacionRepository } from '../../../dominio/repositorios/calificacion.repository.js';
import { Calificacion } from '../../../dominio/entidades/calificacion.entity.js';
import { CalificacionOrmEntity } from '../entidades/calificacion.orm-entity.js';
import { CalificacionOrmMapper } from '../mappers/calificacion.orm-mapper.js';

@Injectable()
export class CalificacionRepositoryImpl implements ICalificacionRepository {
  constructor(
    @InjectRepository(CalificacionOrmEntity)
    private readonly ormRepo: Repository<CalificacionOrmEntity>,
  ) {}

  async guardar(calificacion: Calificacion): Promise<Calificacion> {
    const entity = CalificacionOrmMapper.toOrm(calificacion);
    const guardado = await this.ormRepo.save(entity);
    return CalificacionOrmMapper.toDomain(guardado);
  }

  async existeCalificacion(viajeId: string): Promise<boolean> {
    return await this.ormRepo.exists({ where: { viajeId } });
  }
}
