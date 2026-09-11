import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { SolicitarViajeDto } from '../dto/solicitar-viaje.dto.js';
import { EstimarTarifaUseCase } from '../../../tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';

@Injectable()
export class SolicitarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    private readonly estimarTarifa: EstimarTarifaUseCase,
    private readonly viajesGateway: ViajesGateway,
  ) {}

  async ejecutar(dto: SolicitarViajeDto): Promise<Viaje> {
    const tarifa = await this.estimarTarifa.ejecutar({
      origenLat: dto.origenLat,
      origenLng: dto.origenLng,
      destinoLat: dto.destinoLat,
      destinoLng: dto.destinoLng,
    });

    const viaje = Viaje.solicitar({
      pasajeroId: dto.pasajeroId,
      origenLat: dto.origenLat,
      origenLng: dto.origenLng,
      destinoLat: dto.destinoLat,
      destinoLng: dto.destinoLng,
      tarifaEstimada: tarifa.precio,
    });

    const guardado = await this.viajeRepository.guardar(viaje);

    // Emitir notificación por WebSockets
    this.viajesGateway.notificarNuevoViaje(guardado.id);

    return guardado;
  }
}
