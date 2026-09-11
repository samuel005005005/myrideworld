import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IIdempotenciaRepository } from '../../../dominio/repositorios/idempotencia.repository.js';
import { Idempotencia } from '../../../dominio/entidades/idempotencia.entity.js';
import { IdempotenciaOrmEntity } from '../entidades/idempotencia.orm-entity.js';
import { IdempotenciaOrmMapper } from '../mappers/idempotencia.orm-mapper.js';

@Injectable()
export class IdempotenciaRepositoryImpl implements IIdempotenciaRepository {
  constructor(
    @InjectRepository(IdempotenciaOrmEntity)
    private readonly ormRepo: Repository<IdempotenciaOrmEntity>,
  ) { }

  async obtenerPorLlave(llave: string): Promise<Idempotencia | null> {
    const entity = await this.ormRepo.findOne({ where: { llave } });
    return entity ? IdempotenciaOrmMapper.toDomain(entity) : null;
  }

  async guardar(idempotencia: Idempotencia): Promise<Idempotencia> {
    const entity = IdempotenciaOrmMapper.toOrm(idempotencia);
    const saved = await this.ormRepo.save(entity);
    return IdempotenciaOrmMapper.toDomain(saved);
  }
}
