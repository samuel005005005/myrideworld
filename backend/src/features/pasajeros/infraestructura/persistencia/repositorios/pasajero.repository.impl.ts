import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPasajeroRepository } from '../../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../../dominio/entidades/pasajero.entity.js';
import { PasajeroOrmEntity } from '../entidades/pasajero.orm-entity.js';
import { PasajeroOrmMapper } from '../mappers/pasajero.orm-mapper.js';

@Injectable()
export class PasajeroRepositoryImpl implements IPasajeroRepository {
  constructor(
    @InjectRepository(PasajeroOrmEntity)
    private readonly ormRepo: Repository<PasajeroOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Pasajero | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? PasajeroOrmMapper.toDomain(entity) : null;
  }

  async obtenerPorEmail(email: string): Promise<Pasajero | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    return entity ? PasajeroOrmMapper.toDomain(entity) : null;
  }

  async guardar(pasajero: Pasajero): Promise<Pasajero> {
    const entity = PasajeroOrmMapper.toOrm(pasajero);
    const saved = await this.ormRepo.save(entity);
    return PasajeroOrmMapper.toDomain(saved);
  }

}
