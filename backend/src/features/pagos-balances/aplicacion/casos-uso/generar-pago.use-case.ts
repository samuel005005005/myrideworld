import { Inject, Injectable } from '@nestjs/common';
import type { IPagoBalanceRepository } from '../../dominio/repositorios/pago-balance.repository.js';
import { PAGO_BALANCE_REPOSITORY } from '../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../dominio/entidades/pago-balance.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';

export interface GenerarPagoDto {
  viajeId: string;
  conductorId: string;
  montoTotal: number;
}

@Injectable()
export class GenerarPagoUseCase {
  constructor(
    @Inject(PAGO_BALANCE_REPOSITORY)
    private readonly pagoBalanceRepository: IPagoBalanceRepository,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async ejecutar(dto: GenerarPagoDto): Promise<PagoBalance> {
    const porcentajeFee = Number(await this.configRepo.obtenerValor('FEE_PLATAFORMA', '0.20'));
    
    // Regla de negocio inyectada dinámicamente
    const feeProcesamiento = dto.montoTotal * porcentajeFee;
    const montoNeto = dto.montoTotal - feeProcesamiento;

    const pago = PagoBalance.crear({
      viajeId: dto.viajeId,
      conductorId: dto.conductorId,
      montoBruto: dto.montoTotal,
      feeProcesamiento: feeProcesamiento,
      montoNeto: montoNeto,
      metodo: 'Efectivo', // Por ahora asumimos efectivo para el MVP
    });

    return await this.pagoBalanceRepository.guardar(pago);
  }
}
