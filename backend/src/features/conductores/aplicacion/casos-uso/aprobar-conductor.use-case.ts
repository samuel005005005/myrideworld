import { Injectable, Inject } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';

@Injectable()
export class AprobarConductorUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(id: string): Promise<Conductor> {
    const conductor = await this.conductorRepository.obtenerPorId(id);
    if (!conductor) {
      throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.NO_ENCONTRADO, 404);
    }

    conductor.aprobar();
    return await this.conductorRepository.guardar(conductor);
  }
}
