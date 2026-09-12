import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { Conductor } from '../../../conductores/dominio/entidades/conductor.entity.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';

const RADIO_KM_POR_DEFECTO = 50;

@Injectable()
export class AsignadorConductorService {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async buscarMasCercano(params: {
    origenLat: number;
    origenLng: number;
    excluidos?: string[];
    radioKm?: number;
  }): Promise<Conductor | null> {
    const radioKm = params.radioKm ?? RADIO_KM_POR_DEFECTO;
    const excluidos = new Set(params.excluidos ?? []);

    const candidatos = await this.conductorRepository.obtenerDisponiblesCercanos(
      params.origenLat,
      params.origenLng,
      radioKm,
    );

    let mejor: Conductor | null = null;
    let minimaDistancia = Infinity;

    for (const conductor of candidatos) {
      if (excluidos.has(conductor.id)) {
        continue;
      }
      if (
        conductor.ultimaUbicacionLat === null ||
        conductor.ultimaUbicacionLng === null
      ) {
        continue;
      }

      const distancia = calcularDistanciaKm(
        params.origenLat,
        params.origenLng,
        conductor.ultimaUbicacionLat,
        conductor.ultimaUbicacionLng,
      );

      if (distancia > radioKm) {
        continue;
      }

      if (distancia < minimaDistancia) {
        minimaDistancia = distancia;
        mejor = conductor;
      }
    }

    return mejor;
  }
}
