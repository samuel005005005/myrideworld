import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { AceptarViajeDto } from '../dto/aceptar-viaje.dto.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class AceptarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
  ) {}

  async ejecutar(viajeId: string, dto: AceptarViajeDto): Promise<Viaje> {
    const guardado = await this.viajeRepository.aceptarSiDisponible(
      viajeId,
      dto.conductorId,
    );

    if (!guardado) {
      const existente = await this.viajeRepository.obtenerPorId(viajeId);
      if (!existente) {
        throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
      }
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.YA_ASIGNADO, 409);
    }

    this.notificadorViaje.notificarViajeAceptado(guardado.id, dto.conductorId);

    return guardado;
  }
}
