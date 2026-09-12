import { Inject, Injectable } from '@nestjs/common';
import type { IAdministradorRepository } from '../../dominio/repositorios/administrador.repository.js';
import { ADMINISTRADOR_REPOSITORY } from '../../dominio/repositorios/administrador.repository.js';
import { Administrador } from '../../dominio/entidades/administrador.entity.js';

@Injectable()
export class ListarAdministradoresUseCase {
  constructor(
    @Inject(ADMINISTRADOR_REPOSITORY)
    private readonly repo: IAdministradorRepository,
  ) {}

  async ejecutar(): Promise<Administrador[]> {
    return this.repo.listar();
  }
}
