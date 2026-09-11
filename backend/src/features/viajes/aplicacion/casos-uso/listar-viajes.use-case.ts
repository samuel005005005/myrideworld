import { Injectable, Inject } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';

@Injectable()
export class ListarViajesUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
  ) {}

  async ejecutar(actorId: string, rol: Roles): Promise<Viaje[]> {
    if (rol === Roles.ADMIN) {
      return await this.viajeRepository.listar();
    } else if (rol === Roles.PASAJERO) {
      return await this.viajeRepository.obtenerPorPasajero(actorId);
    } else if (rol === Roles.CONDUCTOR) {
      return await this.viajeRepository.obtenerPorConductor(actorId);
    }
    
    return [];
  }
}
