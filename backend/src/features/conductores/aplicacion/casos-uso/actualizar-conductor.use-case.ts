import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { ActualizarConductorDto } from '../dto/actualizar-conductor.dto.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class ActualizarConductorUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(id: string, dto: ActualizarConductorDto): Promise<Conductor> {
    const conductor = await this.conductorRepository.obtenerPorId(id);
    if (!conductor) {
      throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.NO_ENCONTRADO);
    }

    conductor.actualizarPerfil(dto);

    return await this.conductorRepository.guardar(conductor);
  }
}
