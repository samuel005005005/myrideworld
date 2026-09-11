import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBitacoraRepository } from '../../../dominio/repositorios/bitacora.repository.js';
import { Bitacora } from '../../../dominio/entidades/bitacora.entity.js';
import { BitacoraOrmEntity } from '../entidades/bitacora.orm-entity.js';
import { BitacoraOrmMapper } from '../mappers/bitacora.orm-mapper.js';

@Injectable()
export class BitacoraRepositoryImpl implements IBitacoraRepository {
  constructor(
    @InjectRepository(BitacoraOrmEntity)
    private readonly ormRepo: Repository<BitacoraOrmEntity>,
  ) {}

  async guardar(bitacora: Bitacora): Promise<Bitacora> {
    const entity = BitacoraOrmMapper.toOrm(bitacora);
    const saved = await this.ormRepo.save(entity);
    return BitacoraOrmMapper.toDomain(saved);
  }
}
