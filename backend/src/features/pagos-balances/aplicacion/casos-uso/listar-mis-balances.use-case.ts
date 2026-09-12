import { Inject, Injectable } from '@nestjs/common';
import type { IPagoBalanceRepository } from '../../dominio/repositorios/pago-balance.repository.js';
import { PAGO_BALANCE_REPOSITORY } from '../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../dominio/entidades/pago-balance.entity.js';

@Injectable()
export class ListarMisBalancesUseCase {
  constructor(
    @Inject(PAGO_BALANCE_REPOSITORY)
    private readonly pagoBalanceRepository: IPagoBalanceRepository,
  ) {}

  async ejecutar(conductorId: string): Promise<PagoBalance[]> {
    return this.pagoBalanceRepository.obtenerPorConductor(conductorId);
  }
}
