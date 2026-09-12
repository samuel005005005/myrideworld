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

  async listar(busqueda?: string): Promise<Pasajero[]> {
    const qb = this.ormRepo
      .createQueryBuilder('p')
      .orderBy('p.fechaRegistro', 'DESC')
      .take(200);

    if (busqueda?.trim()) {
      const q = `%${busqueda.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(p.nombreCompleto) LIKE :q OR LOWER(p.email) LIKE :q OR p.telefono LIKE :q)',
        { q },
      );
    }

    const entities = await qb.getMany();
    return entities.map((e) => PasajeroOrmMapper.toDomain(e));
  }

  async guardar(pasajero: Pasajero): Promise<Pasajero> {
    const entity = PasajeroOrmMapper.toOrm(pasajero);
    const saved = await this.ormRepo.save(entity);
    return PasajeroOrmMapper.toDomain(saved);
  }

}
