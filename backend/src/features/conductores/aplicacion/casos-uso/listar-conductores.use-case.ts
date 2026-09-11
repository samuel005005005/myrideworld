import { Injectable, Inject } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';

@Injectable()
export class ListarConductoresUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) { }

  async ejecutar(filtros?: { estadoAprobacion?: EstadosConductor }): Promise<Conductor[]> {
    return await this.conductorRepository.listar(filtros);
  }
}
