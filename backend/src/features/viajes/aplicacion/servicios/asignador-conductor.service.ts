import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { Conductor } from '../../../conductores/dominio/entidades/conductor.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { FlotaConductoresActivosRegistry } from '../../../conductores/aplicacion/servicios/flota-conductores-activos.registry.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const C = MENSAJES.EXCEPCIONES.CONFIGURACION;
const RADIO_KM_POR_DEFECTO = 15;
const LIMITE_POR_DEFECTO = 5;

@Injectable()
export class AsignadorConductorService {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
    private readonly flotaActiva: FlotaConductoresActivosRegistry,
  ) {}

  async buscarCercanos(params: {
    origenLat: number;
    origenLng: number;
    excluidos?: string[];
    radioKm?: number;
    limite?: number;
  }): Promise<Conductor[]> {
    const radioKm =
      params.radioKm ??
      (await this._leerNumero(C.CLAVE_RADIO_ASIGNACION_KM, RADIO_KM_POR_DEFECTO));
    const limite =
      params.limite ??
      (await this._leerNumero(
        C.CLAVE_MAX_CONDUCTORES_OFERTA_PARALELA,
        LIMITE_POR_DEFECTO,
      ));
    const excluidos = new Set(params.excluidos ?? []);

    const candidatos = await this.conductorRepository.obtenerDisponiblesCercanos(
      params.origenLat,
      params.origenLng,
      radioKm,
    );

    const ranqueados: { conductor: Conductor; distancia: number }[] = [];

    for (const conductor of candidatos) {
      if (excluidos.has(conductor.id)) {
        continue;
      }
      if (!this.flotaActiva.estaActivoEnFlota(conductor.id)) {
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

      ranqueados.push({ conductor, distancia });
    }

    ranqueados.sort((a, b) => {
      if (a.distancia !== b.distancia) {
        return a.distancia - b.distancia;
      }
      return a.conductor.id.localeCompare(b.conductor.id);
    });

    const tope = Math.max(1, Math.floor(limite));
    return ranqueados.slice(0, tope).map((item) => item.conductor);
  }

  async buscarMasCercano(params: {
    origenLat: number;
    origenLng: number;
    excluidos?: string[];
    radioKm?: number;
  }): Promise<Conductor | null> {
    const lista = await this.buscarCercanos({ ...params, limite: 1 });
    return lista[0] ?? null;
  }

  private async _leerNumero(clave: string, fallback: number): Promise<number> {
    const raw = Number(await this.configRepo.obtenerValor(clave, String(fallback)));
    return Number.isFinite(raw) && raw > 0 ? raw : fallback;
  }
}
