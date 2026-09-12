import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class IniciarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
  ) {}

  async ejecutar(id: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(id);
    
    if (!viaje) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    viaje.iniciarViaje();

    const guardado = await this.viajeRepository.guardar(viaje);
    
    this.notificadorViaje.notificarViajeIniciado(guardado.id);
    
    return guardado;
  }
}
