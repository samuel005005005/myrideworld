import { Injectable, Inject } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';

export interface FiltrosListarViajes {
  estado?: string;
  desde?: Date;
  hasta?: Date;
}

@Injectable()
export class ListarViajesUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
  ) {}

  async ejecutar(
    actorId: string,
    rol: Roles,
    filtros?: FiltrosListarViajes,
  ): Promise<Viaje[]> {
    if (rol === Roles.ADMIN) {
      return this.viajeRepository.listar({
        estado: filtros?.estado,
        desde: filtros?.desde,
        hasta: filtros?.hasta,
        limite: 200,
      });
    }
    if (rol === Roles.PASAJERO) {
      return this.viajeRepository.obtenerPorPasajero(actorId);
    }
    if (rol === Roles.CONDUCTOR) {
      return this.viajeRepository.obtenerPorConductor(actorId);
    }

    return [];
  }
}
