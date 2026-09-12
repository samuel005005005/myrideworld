import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IBitacoraRepository,
  FiltrosBitacora,
} from '../../../dominio/repositorios/bitacora.repository.js';
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

  async listar(filtros?: FiltrosBitacora): Promise<Bitacora[]> {
    const qb = this.ormRepo
      .createQueryBuilder('b')
      .orderBy('b.fecha', 'DESC')
      .take(filtros?.limite ?? 200);

    if (filtros?.desde) {
      qb.andWhere('b.fecha >= :desde', { desde: filtros.desde });
    }
    if (filtros?.hasta) {
      qb.andWhere('b.fecha <= :hasta', { hasta: filtros.hasta });
    }
    if (filtros?.servicio) {
      qb.andWhere('b.servicioSistema = :servicio', {
        servicio: filtros.servicio,
      });
    }
    if (filtros?.accion) {
      qb.andWhere('b.accion = :accion', { accion: filtros.accion });
    }

    const entities = await qb.getMany();
    return entities.map((e) => BitacoraOrmMapper.toDomain(e));
  }
}
