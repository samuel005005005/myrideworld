import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

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
      throw new NotFoundException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    if (rol === Roles.PASAJERO && viaje.pasajeroId !== actorId) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.CANCELACION_NO_SOLICITADO);
    }
    if (rol === Roles.CONDUCTOR && viaje.conductorId !== actorId) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.CANCELACION_NO_ASIGNADO);
    }

    viaje.cancelar(rol, motivo);

    const guardado = await this.viajeRepository.guardar(viaje);

    this.viajesGateway.notificarViajeCancelado(guardado.id, rol, motivo);

    return guardado;
  }
}
