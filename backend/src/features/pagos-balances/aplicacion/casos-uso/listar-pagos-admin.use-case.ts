import { Inject, Injectable } from '@nestjs/common';
import type {
  IPagoBalanceRepository,
  FiltrosPagoBalance,
} from '../../dominio/repositorios/pago-balance.repository.js';
import { PAGO_BALANCE_REPOSITORY } from '../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../dominio/entidades/pago-balance.entity.js';

@Injectable()
export class ListarPagosAdminUseCase {
  constructor(
    @Inject(PAGO_BALANCE_REPOSITORY)
    private readonly repo: IPagoBalanceRepository,
  ) {}

  async ejecutar(filtros?: FiltrosPagoBalance): Promise<PagoBalance[]> {
    return this.repo.listar(filtros);
  }
}
