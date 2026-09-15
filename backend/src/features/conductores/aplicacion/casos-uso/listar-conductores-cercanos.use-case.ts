import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';
import { ConductorMapper } from '../mappers/conductor.mapper.js';
import type { ConductorCercanoMapaDto } from '../dto/conductor-cercano-mapa.dto.js';

const C = MENSAJES.EXCEPCIONES.CONFIGURACION;
const RADIO_DEFAULT = '25';

@Injectable()
export class ListarConductoresCercanosUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async ejecutar(params: {
    lat: number;
    lng: number;
    radioKm?: number;
  }): Promise<ConductorCercanoMapaDto[]> {
    const radioConfig = Number(
      await this.configRepo.obtenerValor(C.CLAVE_RADIO_MAPA_FLOTA_KM, RADIO_DEFAULT),
    );
    const radioKm =
      params.radioKm ??
      (Number.isFinite(radioConfig) && radioConfig > 0 ? radioConfig : 15);

    const candidatos = await this.conductorRepository.obtenerDisponiblesCercanos(
      params.lat,
      params.lng,
      radioKm,
    );

    const resultado: ConductorCercanoMapaDto[] = [];
    for (const conductor of candidatos) {
      const lat = conductor.ultimaUbicacionLat;
      const lng = conductor.ultimaUbicacionLng;
      if (lat === null || lng === null) {
        continue;
      }
      if (calcularDistanciaKm(params.lat, params.lng, lat, lng) > radioKm) {
        continue;
      }
      resultado.push(ConductorMapper.toCercanoMapa(conductor));
    }
    return resultado;
  }
}
