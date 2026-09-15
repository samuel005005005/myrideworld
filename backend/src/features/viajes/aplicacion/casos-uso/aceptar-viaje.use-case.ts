import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { AceptarViajeDto } from '../dto/aceptar-viaje.dto.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { ConductorMapper } from '../../../conductores/aplicacion/mappers/conductor.mapper.js';

@Injectable()
export class AceptarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
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
      if (existente.estado === EstadosViaje.CANCELADO) {
        throw new DomainException(
          MENSAJES.EXCEPCIONES.VIAJES.CANCELADO_NO_ACEPTABLE,
          409,
        );
      }
      if (existente.conductorId === dto.conductorId) {
        return existente;
      }
      if (existente.conductorId) {
        throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.YA_ASIGNADO, 409);
      }
      throw new DomainException(
        MENSAJES.EXCEPCIONES.VIAJES.YA_NO_DISPONIBLE,
        409,
      );
    }

    const conductor = await this.conductorRepository.obtenerPorId(
      dto.conductorId,
    );

    this.notificadorViaje.notificarViajeAceptado({
      viajeId: guardado.id,
      conductorId: dto.conductorId,
      conductor: conductor ? ConductorMapper.toResumenPublico(conductor) : null,
    });

    return guardado;
  }
}
