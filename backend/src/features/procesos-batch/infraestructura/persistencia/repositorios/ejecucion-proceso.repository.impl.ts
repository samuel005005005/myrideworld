import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IEjecucionProcesoRepository } from '../../../dominio/repositorios/ejecucion-proceso.repository.js';
import { EjecucionProceso } from '../../../dominio/entidades/ejecucion-proceso.entity.js';
import { DetalleEjecucionProceso } from '../../../dominio/entidades/detalle-ejecucion.entity.js';
import { EjecucionProcesoOrmEntity } from '../entidades/ejecucion-proceso.orm-entity.js';
import { DetalleEjecucionOrmEntity } from '../entidades/detalle-ejecucion.orm-entity.js';
import { EjecucionProcesoOrmMapper } from '../mappers/ejecucion-proceso.orm-mapper.js';

@Injectable()
export class EjecucionProcesoRepositoryImpl implements IEjecucionProcesoRepository {
  constructor(
    @InjectRepository(EjecucionProcesoOrmEntity)
    private readonly procesoRepo: Repository<EjecucionProcesoOrmEntity>,
    @InjectRepository(DetalleEjecucionOrmEntity)
    private readonly detalleRepo: Repository<DetalleEjecucionOrmEntity>,
  ) {}

  async guardarEjecucion(ejecucion: EjecucionProceso): Promise<EjecucionProceso> {
    const ormEntity = EjecucionProcesoOrmMapper.toOrm(ejecucion);
    const guardado = await this.procesoRepo.save(ormEntity);
    return EjecucionProcesoOrmMapper.toDomain(guardado as EjecucionProcesoOrmEntity);
  }

  async guardarDetalle(detalle: DetalleEjecucionProceso): Promise<DetalleEjecucionProceso> {
    const ormEntity = EjecucionProcesoOrmMapper.detalleToOrm(detalle);
    const guardado = await this.detalleRepo.save(ormEntity);
    return EjecucionProcesoOrmMapper.detalleToDomain(guardado as DetalleEjecucionOrmEntity);
  }
}
