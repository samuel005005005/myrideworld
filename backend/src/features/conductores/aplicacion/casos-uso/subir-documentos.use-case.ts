import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class SubirDocumentosUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(id: string, rutas: { fotoPerfil?: string; licencia?: string; seguro?: string }): Promise<Conductor> {
    const conductor = await this.conductorRepository.obtenerPorId(id);
    if (!conductor) {
      throw new NotFoundException(MENSAJES.EXCEPCIONES.CONDUCTORES.NO_ENCONTRADO);
    }

    conductor.actualizarDocumentos(rutas);
    return await this.conductorRepository.guardar(conductor);
  }
}
