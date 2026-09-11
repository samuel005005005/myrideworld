import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagoBalanceRepository } from '../../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../../dominio/entidades/pago-balance.entity.js';
import { PagoBalanceOrmEntity } from '../entidades/pago-balance.orm-entity.js';

@Injectable()
export class PagoBalanceRepositoryImpl implements IPagoBalanceRepository {
  constructor(
    @InjectRepository(PagoBalanceOrmEntity)
    private readonly ormRepo: Repository<PagoBalanceOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<PagoBalance | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async obtenerPorViaje(viajeId: string): Promise<PagoBalance | null> {
    const entity = await this.ormRepo.findOne({ where: { viajeId } });
    return entity ? this.toDomain(entity) : null;
  }

  async obtenerPorConductor(conductorId: string): Promise<PagoBalance[]> {
    const entities = await this.ormRepo.find({ where: { conductorId } });
    return entities.map(e => this.toDomain(e));
  }

  async guardar(pago: PagoBalance): Promise<PagoBalance> {
    const entity = this.toOrm(pago);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: PagoBalanceOrmEntity): PagoBalance {
    return PagoBalance.crear({
      id: entity.id,
      viajeId: entity.viajeId,
      conductorId: entity.conductorId,
      montoBruto: Number(entity.montoBruto),
      feeProcesamiento: Number(entity.feeProcesamiento),
      montoNeto: Number(entity.montoNeto),
      metodo: entity.metodo,
      fecha: entity.fecha,
    });
  }

  private toOrm(pago: PagoBalance): Partial<PagoBalanceOrmEntity> {
    return {
      id: pago.id,
      viajeId: pago.viajeId,
      conductorId: pago.conductorId,
      montoBruto: pago.montoBruto,
      feeProcesamiento: pago.feeProcesamiento,
      montoNeto: pago.montoNeto,
      metodo: pago.metodo,
    };
  }
}
