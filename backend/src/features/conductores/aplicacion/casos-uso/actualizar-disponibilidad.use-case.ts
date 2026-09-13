import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { ActualizarDisponibilidadDto } from '../dto/actualizar-disponibilidad.dto.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';

@Injectable()
export class ActualizarDisponibilidadUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(
    id: string,
    dto: ActualizarDisponibilidadDto,
  ): Promise<Conductor> {
    const conductor = await this.conductorRepository.obtenerPorId(id);
    if (!conductor) {
      throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.NO_ENCONTRADO);
    }

    if (
      dto.estadoDisponibilidad === EstadosDisponibilidadConductor.CONECTADO &&
      typeof dto.lat === 'number' &&
      typeof dto.lng === 'number'
    ) {
      conductor.actualizarUbicacion(dto.lat, dto.lng);
    }

    conductor.actualizarDisponibilidad(dto.estadoDisponibilidad);
    return this.conductorRepository.guardar(conductor);
  }
}
