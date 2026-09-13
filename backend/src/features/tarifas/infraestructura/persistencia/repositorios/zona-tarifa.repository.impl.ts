import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IZonaTarifaRepository } from '../../../dominio/repositorios/zona-tarifa.repository.js';
import { ZonaTarifa } from '../../../dominio/entidades/zona-tarifa.entity.js';
import { ZonaTarifaOrmEntity } from '../entidades/zona-tarifa.orm-entity.js';
import { ZonaTarifaOrmMapper } from '../mappers/zona-tarifa.orm-mapper.js';

@Injectable()
export class ZonaTarifaRepositoryImpl implements IZonaTarifaRepository {
  constructor(
    @InjectRepository(ZonaTarifaOrmEntity)
    private readonly ormRepo: Repository<ZonaTarifaOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<ZonaTarifa | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? ZonaTarifaOrmMapper.toDomain(entity) : null;
  }

  async obtenerPorNombre(nombre: string): Promise<ZonaTarifa | null> {
    const entity = await this.ormRepo.findOne({
      where: { nombre: nombre.trim() },
    });
    return entity ? ZonaTarifaOrmMapper.toDomain(entity) : null;
  }

  async listar(soloActivas = false): Promise<ZonaTarifa[]> {
    const where = soloActivas ? { activa: true } : {};
    const entities = await this.ormRepo.find({
      where,
      order: { nombre: 'ASC' },
    });
    return entities.map((e) => ZonaTarifaOrmMapper.toDomain(e));
  }

  async guardar(zona: ZonaTarifa): Promise<ZonaTarifa> {
    const saved = await this.ormRepo.save(
      ZonaTarifaOrmMapper.toOrm(zona) as ZonaTarifaOrmEntity,
    );
    return ZonaTarifaOrmMapper.toDomain(saved);
  }
}
