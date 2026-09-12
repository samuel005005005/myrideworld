import { Inject, Injectable } from '@nestjs/common';
import type {
  IPagoBalanceRepository,
  FiltrosPagoBalance,
  ResumenLiquidacion,
} from '../../dominio/repositorios/pago-balance.repository.js';
import { PAGO_BALANCE_REPOSITORY } from '../../dominio/repositorios/pago-balance.repository.js';

@Injectable()
export class ObtenerLiquidacionUseCase {
  constructor(
    @Inject(PAGO_BALANCE_REPOSITORY)
    private readonly repo: IPagoBalanceRepository,
  ) {}

  async ejecutar(filtros?: FiltrosPagoBalance): Promise<ResumenLiquidacion> {
    return this.repo.resumenLiquidacion(filtros);
  }
}
