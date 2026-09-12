import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class ValidadorProximidadViajeService {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configuracionRepository: IConfiguracionRepository,
  ) {}

  async asegurarCercaDe(
    conductorId: string,
    destinoLat: number,
    destinoLng: number,
    claveRadioMetros: string,
  ): Promise<void> {
    const conductor = await this.conductorRepository.obtenerPorId(conductorId);
    if (!conductor) {
      throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.NO_ENCONTRADO);
    }

    if (
      conductor.ultimaUbicacionLat === null ||
      conductor.ultimaUbicacionLng === null
    ) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.VIAJES.GPS_CONDUCTOR_REQUERIDO,
        400,
      );
    }

    const radioMetros = await this.obtenerRadioMetros(claveRadioMetros);
    const distanciaKm = calcularDistanciaKm(
      conductor.ultimaUbicacionLat,
      conductor.ultimaUbicacionLng,
      destinoLat,
      destinoLng,
    );
    const distanciaMetros = distanciaKm * 1000;

    if (distanciaMetros > radioMetros) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.VIAJES.FUERA_DE_PROXIMIDAD(
          Math.round(distanciaMetros),
          radioMetros,
        ),
        400,
      );
    }
  }

  private async obtenerRadioMetros(clave: string): Promise<number> {
    const config = await this.configuracionRepository.obtenerPorClave(clave);
    if (!config) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONFIGURACION.NO_DEFINIDA(clave),
        503,
      );
    }

    const valor = Number(config.valor);
    if (!Number.isFinite(valor) || valor <= 0) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONFIGURACION.VALOR_NUMERICO_INVALIDO(clave),
        503,
      );
    }

    return valor;
  }
}
