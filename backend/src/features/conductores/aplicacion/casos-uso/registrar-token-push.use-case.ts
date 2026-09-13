import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class RegistrarTokenPushUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(conductorId: string, token: string): Promise<Conductor> {
    const conductor = await this.conductorRepository.obtenerPorId(conductorId);
    if (!conductor) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONDUCTORES.NO_ENCONTRADO,
        404,
      );
    }
    conductor.registrarTokenPush(token);
    return this.conductorRepository.guardar(conductor);
  }
}
