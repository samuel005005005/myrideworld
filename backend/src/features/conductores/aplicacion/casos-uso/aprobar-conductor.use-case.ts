import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';

@Injectable()
export class AprobarConductorUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(conductorId: string): Promise<Conductor> {
    const conductor = await this.conductorRepository.obtenerPorId(conductorId);
    if (!conductor) {
      throw new NotFoundException('Conductor no encontrado');
    }

    conductor.aprobar();
    return await this.conductorRepository.guardar(conductor);
  }
}
