import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';

const ESTADOS_ACTIVOS = new Set<string>([
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

  async ejecutar(conductorId: string): Promise<Viaje | null> {
    const viajes = await this.viajeRepository.obtenerPorConductor(conductorId);
    return (
      viajes.find((viaje) => ESTADOS_ACTIVOS.has(viaje.estado)) ?? null
    );
  }
}
