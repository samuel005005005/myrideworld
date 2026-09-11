import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';

@Injectable()
export class CancelarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    private readonly viajesGateway: ViajesGateway,
  ) {}

  async ejecutar(viajeId: string, actorId: string, rol: Roles, motivo?: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    if (rol === Roles.PASAJERO && viaje.pasajeroId !== actorId) {
      throw new Error('No puedes cancelar un viaje que no solicitaste.');
    }
    if (rol === Roles.CONDUCTOR && viaje.conductorId !== actorId) {
      throw new Error('No puedes cancelar un viaje que no tienes asignado.');
    }

    viaje.cancelar(rol, motivo);

    const guardado = await this.viajeRepository.guardar(viaje);

    this.viajesGateway.notificarViajeCancelado(guardado.id, rol, motivo);

    return guardado;
  }
}
