import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';

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
      throw new NotFoundException('Viaje no encontrado');
    }

    if (viaje.conductorId !== conductorId) {
      throw new Error('Solo el conductor asignado puede marcar la llegada.');
    }

    viaje.marcarLlegada();

    const guardado = await this.viajeRepository.guardar(viaje);

    // Notificamos al pasajero que el conductor está esperando afuera
    this.viajesGateway.notificarConductorLlego(guardado.id);

    return guardado;
  }
}
