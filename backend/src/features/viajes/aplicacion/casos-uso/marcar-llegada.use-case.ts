import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class MarcarLlegadaUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    private readonly viajesGateway: ViajesGateway,
  ) {}

  async ejecutar(viajeId: string, conductorId: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    if (!viaje) {
      throw new NotFoundException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    if (viaje.conductorId !== conductorId) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.LLEGADA_SOLO_CONDUCTOR);
    }

    viaje.marcarLlegada();

    const guardado = await this.viajeRepository.guardar(viaje);

    // Notificamos al pasajero que el conductor está esperando afuera
    this.viajesGateway.notificarConductorLlego(guardado.id);

    return guardado;
  }
}
