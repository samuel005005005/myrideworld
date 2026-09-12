import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPagoBalanceRepository,
  FiltrosPagoBalance,
  ResumenLiquidacion,
} from '../../../dominio/repositorios/pago-balance.repository.js';
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
    return entities.map((e) => PagoBalanceOrmMapper.toDomain(e));
  }

  async listar(filtros?: FiltrosPagoBalance): Promise<PagoBalance[]> {
    const qb = this.ormRepo
      .createQueryBuilder('p')
      .orderBy('p.fecha', 'DESC')
      .take(500);

    if (filtros?.conductorId) {
      qb.andWhere('p.conductorId = :conductorId', {
        conductorId: filtros.conductorId,
      });
    }
    if (filtros?.desde) {
      qb.andWhere('p.fecha >= :desde', { desde: filtros.desde });
    }
    if (filtros?.hasta) {
      qb.andWhere('p.fecha <= :hasta', { hasta: filtros.hasta });
    }

    const entities = await qb.getMany();
    return entities.map((e) => PagoBalanceOrmMapper.toDomain(e));
  }

  async resumenLiquidacion(
    filtros?: FiltrosPagoBalance,
  ): Promise<ResumenLiquidacion> {
    const qb = this.ormRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.montoBruto), 0)', 'totalBruto')
      .addSelect('COALESCE(SUM(p.feeProcesamiento), 0)', 'totalFee')
      .addSelect('COALESCE(SUM(p.montoNeto), 0)', 'totalNeto')
      .addSelect('COUNT(*)', 'cantidad');

    if (filtros?.conductorId) {
      qb.andWhere('p.conductorId = :conductorId', {
        conductorId: filtros.conductorId,
      });
    }
    if (filtros?.desde) {
      qb.andWhere('p.fecha >= :desde', { desde: filtros.desde });
    }
    if (filtros?.hasta) {
      qb.andWhere('p.fecha <= :hasta', { hasta: filtros.hasta });
    }

    const raw = await qb.getRawOne<{
      totalBruto: string;
      totalFee: string;
      totalNeto: string;
      cantidad: string;
    }>();

    return {
      totalBruto: Number(raw?.totalBruto ?? 0),
      totalFee: Number(raw?.totalFee ?? 0),
      totalNeto: Number(raw?.totalNeto ?? 0),
      cantidad: Number(raw?.cantidad ?? 0),
    };
  }

  async guardar(pago: PagoBalance): Promise<PagoBalance> {
    const entity = PagoBalanceOrmMapper.toOrm(pago);
    const saved = await this.ormRepo.save(entity);
    return PagoBalanceOrmMapper.toDomain(saved);
  }
}
