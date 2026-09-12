import { Inject, Injectable } from '@nestjs/common';
import type { IConfiguracionRepository } from '../../dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../dominio/repositorios/configuracion.repository.js';
import { Configuracion } from '../../dominio/entidades/configuracion.entity.js';

@Injectable()
export class ListarConfiguracionesUseCase {
  constructor(
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async ejecutar(): Promise<Configuracion[]> {
    return this.configRepo.listar();
  }
}
