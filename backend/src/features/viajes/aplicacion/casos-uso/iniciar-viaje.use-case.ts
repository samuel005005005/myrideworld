import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { ValidadorProximidadViajeService } from '../servicios/validador-proximidad-viaje.service.js';

@Injectable()
export class IniciarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
    private readonly validadorProximidad: ValidadorProximidadViajeService,
  ) {}

  async ejecutar(id: string, conductorId: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(id);

    if (!viaje) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    if (viaje.conductorId !== conductorId) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.VIAJES.ACCION_SOLO_CONDUCTOR_ASIGNADO,
        403,
      );
    }

    await this.validadorProximidad.asegurarCercaDe(
      conductorId,
      viaje.origenLat,
      viaje.origenLng,
      MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_RADIO_PROXIMIDAD_ORIGEN_M,
    );

    viaje.iniciarViaje();

    const guardado = await this.viajeRepository.guardar(viaje);

    this.notificadorViaje.notificarViajeIniciado(guardado.id);

    return guardado;
  }
}
