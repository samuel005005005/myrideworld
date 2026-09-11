import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagoBalanceRepository } from '../../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../../dominio/entidades/pago-balance.entity.js';
import { PagoBalanceOrmEntity } from '../entidades/pago-balance.orm-entity.js';
import { PagoBalanceOrmMapper } from '../mappers/pago-balance.orm-mapper.js';

@Injectable()
export class PagoBalanceRepositoryImpl implements IPagoBalanceRepository {
  constructor(
    @InjectRepository(PagoBalanceOrmEntity)
    private readonly ormRepo: Repository<PagoBalanceOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<PagoBalance | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? PagoBalanceOrmMapper.toDomain(entity) : null;
  }

  async obtenerPorViaje(viajeId: string): Promise<PagoBalance | null> {
    const entity = await this.ormRepo.findOne({ where: { viajeId } });
    return entity ? PagoBalanceOrmMapper.toDomain(entity) : null;
  }

  async obtenerPorConductor(conductorId: string): Promise<PagoBalance[]> {
    const entities = await this.ormRepo.find({ where: { conductorId } });
    return entities.map(e => PagoBalanceOrmMapper.toDomain(e));
  }

  async guardar(pago: PagoBalance): Promise<PagoBalance> {
    const entity = PagoBalanceOrmMapper.toOrm(pago);
    const saved = await this.ormRepo.save(entity);
    return PagoBalanceOrmMapper.toDomain(saved);
  }
}
