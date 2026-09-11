import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';

@Injectable()
export class CancelarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    private readonly viajesGateway: ViajesGateway,
  ) {}

  async ejecutar(viajeId: string, actorId: string, rol: 'PASAJERO' | 'CONDUCTOR', motivo?: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    if (rol === 'PASAJERO' && viaje.pasajeroId !== actorId) {
      throw new Error('No puedes cancelar un viaje que no solicitaste.');
    }
    if (rol === 'CONDUCTOR' && viaje.conductorId !== actorId) {
      throw new Error('No puedes cancelar un viaje que no tienes asignado.');
    }

    viaje.cancelar(rol, motivo);

    const guardado = await this.viajeRepository.guardar(viaje);

    this.viajesGateway.notificarViajeCancelado(guardado.id, rol, motivo);

    return guardado;
  }
}
