import { Inject, Injectable } from '@nestjs/common';
import type { IPagoBalanceRepository } from '../../dominio/repositorios/pago-balance.repository.js';
import { PAGO_BALANCE_REPOSITORY } from '../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../dominio/entidades/pago-balance.entity.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class ObtenerPagoPorViajeUseCase {
  constructor(
    @Inject(PAGO_BALANCE_REPOSITORY)
    private readonly pagoBalanceRepository: IPagoBalanceRepository,
  ) {}

  async ejecutar(viajeId: string, conductorId: string): Promise<PagoBalance> {
    const pago = await this.pagoBalanceRepository.obtenerPorViaje(viajeId);
    if (!pago || pago.conductorId !== conductorId) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.PAGOS_BALANCES.NO_ENCONTRADO,
        404,
      );
    }
    return pago;
  }
}
