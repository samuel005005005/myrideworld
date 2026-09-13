import { Inject, Injectable } from '@nestjs/common';
import type { IZonaTarifaRepository } from '../../dominio/repositorios/zona-tarifa.repository.js';
import { ZONA_TARIFA_REPOSITORY } from '../../dominio/repositorios/zona-tarifa.repository.js';
import { ZonaTarifa } from '../../dominio/entidades/zona-tarifa.entity.js';

@Injectable()
export class ListarZonasTarifaUseCase {
  constructor(
    @Inject(ZONA_TARIFA_REPOSITORY)
    private readonly repo: IZonaTarifaRepository,
  ) {}

  async ejecutar(soloActivas = true): Promise<ZonaTarifa[]> {
    return this.repo.listar(soloActivas);
  }
}
