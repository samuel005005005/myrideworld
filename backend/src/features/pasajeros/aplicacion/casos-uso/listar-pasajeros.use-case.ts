import { Inject, Injectable } from '@nestjs/common';
import type { IPasajeroRepository } from '../../dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';

@Injectable()
export class ListarPasajerosUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(busqueda?: string): Promise<Pasajero[]> {
    return this.pasajeroRepository.listar(busqueda);
  }
}
