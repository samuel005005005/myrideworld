import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';

@Injectable()
export class CompletarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    private readonly generarPago: GenerarPagoUseCase,
  ) {}

  async ejecutar(viajeId: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    
    if (!viaje) {
      throw new Error('Viaje no encontrado.');
    }

    viaje.completarViaje();

    const guardado = await this.viajeRepository.guardar(viaje);

    // Generamos el pago automáticamente al completar el viaje
    if (viaje.conductorId) {
      await this.generarPago.ejecutar({
        viajeId: viaje.id,
        conductorId: viaje.conductorId,
        montoTotal: viaje.tarifaEstimada,
      });
    }

    return guardado;
  }
}
