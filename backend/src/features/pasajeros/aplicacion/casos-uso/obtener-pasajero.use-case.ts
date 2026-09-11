import { Inject, Injectable } from '@nestjs/common';
import type { IPasajeroRepository } from '../../dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class ObtenerPasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(id: string): Promise<Pasajero> {
    const pasajero = await this.pasajeroRepository.obtenerPorId(id);
    if (!pasajero) {
      throw new DomainException(MENSAJES.EXCEPCIONES.PASAJEROS.NO_ENCONTRADO);
    }
    return pasajero;
  }
}
