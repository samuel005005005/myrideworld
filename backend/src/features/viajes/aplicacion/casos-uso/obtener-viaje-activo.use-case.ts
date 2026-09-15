import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';

const ESTADOS_ACTIVOS_CONDUCTOR = new Set<string>([
  EstadosViaje.ASIGNADO,
  EstadosViaje.EN_CAMINO,
  EstadosViaje.LLEGO,
  EstadosViaje.EN_CURSO,
]);

const ESTADOS_ACTIVOS_PASAJERO = new Set<string>([
  EstadosViaje.SOLICITADO,
  EstadosViaje.BUSCANDO,
  EstadosViaje.ASIGNADO,
  EstadosViaje.EN_CAMINO,
  EstadosViaje.LLEGO,
  EstadosViaje.EN_CURSO,
]);

@Injectable()
export class ObtenerViajeActivoUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
  ) {}

  async ejecutar(actorId: string, rol: Roles): Promise<Viaje | null> {
    if (rol === Roles.CONDUCTOR) {
      const viajes = await this.viajeRepository.obtenerPorConductor(actorId);
      return (
        viajes.find((viaje) => ESTADOS_ACTIVOS_CONDUCTOR.has(viaje.estado)) ??
        null
      );
    }

    if (rol === Roles.PASAJERO) {
      const viajes = await this.viajeRepository.obtenerPorPasajero(actorId);
      return (
        viajes.find((viaje) => ESTADOS_ACTIVOS_PASAJERO.has(viaje.estado)) ??
        null
      );
    }

    return null;
  }
}
