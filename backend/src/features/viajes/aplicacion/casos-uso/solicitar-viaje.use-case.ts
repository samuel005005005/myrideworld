import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { SolicitarViajeDto } from '../dto/solicitar-viaje.dto.js';
import { EstimarTarifaUseCase } from '../../../tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { AsignadorConductorService } from '../servicios/asignador-conductor.service.js';

@Injectable()
export class SolicitarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    private readonly estimarTarifa: EstimarTarifaUseCase,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
    private readonly asignadorConductor: AsignadorConductorService,
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

    const conductorSugerido = await this.asignadorConductor.buscarMasCercano({
      origenLat: guardado.origenLat,
      origenLng: guardado.origenLng,
      excluidos: guardado.conductoresRechazados,
    });

    if (conductorSugerido) {
      this.notificadorViaje.notificarNuevoViaje(conductorSugerido.id, {
        id: guardado.id,
        origenLat: guardado.origenLat,
        origenLng: guardado.origenLng,
        destinoLat: guardado.destinoLat,
        destinoLng: guardado.destinoLng,
        tarifaEstimada: Number(guardado.tarifaEstimada),
      });
    }

    return guardado;
  }
}
