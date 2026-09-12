import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';

@Injectable()
export class ListarTarifasUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async ejecutar(estado?: EstadosTarifa): Promise<Tarifa[]> {
    return this.tarifaRepository.listar(estado);
  }
}
