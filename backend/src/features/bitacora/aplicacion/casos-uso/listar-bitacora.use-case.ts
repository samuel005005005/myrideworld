import { Inject, Injectable } from '@nestjs/common';
import type {
  IBitacoraRepository,
  FiltrosBitacora,
} from '../../dominio/repositorios/bitacora.repository.js';
import { BITACORA_REPOSITORY } from '../../dominio/repositorios/bitacora.repository.js';
import { Bitacora } from '../../dominio/entidades/bitacora.entity.js';

@Injectable()
export class ListarBitacoraUseCase {
  constructor(
    @Inject(BITACORA_REPOSITORY)
    private readonly repo: IBitacoraRepository,
  ) {}

  async ejecutar(filtros?: FiltrosBitacora): Promise<Bitacora[]> {
    return this.repo.listar(filtros);
  }
}
