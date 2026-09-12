import { Injectable, Inject } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class MarcarLlegadaUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
  ) {}

  async ejecutar(viajeId: string, conductorId: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    if (!viaje) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    if (viaje.conductorId !== conductorId) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.LLEGADA_SOLO_CONDUCTOR);
    }

    viaje.marcarLlegada();

    const guardado = await this.viajeRepository.guardar(viaje);

    // Notificamos al pasajero que el conductor está esperando afuera
    this.notificadorViaje.notificarConductorLlego(guardado.id);

    return guardado;
  }
}
