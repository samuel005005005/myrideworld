import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { EstimarTarifaDto } from '../dto/estimar-tarifa.dto.js';
import { EstimacionTarifaResultado } from '../dto/estimacion-tarifa-resultado.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';
import { parsearGeocercaBbox } from '../../../../compartidos/utilidades/parsear-geocerca-bbox.util.js';
import { puntoEnGeocercaBbox } from '../../../../compartidos/utilidades/punto-en-geocerca-bbox.util.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { TiposViajeTarifa } from '../../../../compartidos/constantes/tipos-viaje-tarifa.enum.js';

@Injectable()
export class EstimarTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async ejecutar(
    dto: EstimarTarifaDto,
    persistir = false,
  ): Promise<EstimacionTarifaResultado> {
    const distancia = calcularDistanciaKm(
      dto.origenLat,
      dto.origenLng,
      dto.destinoLat,
      dto.destinoLng,
    );

    const precioCapCana = await this.intentarTarifaPlanaCapCana(dto);
    if (precioCapCana !== null) {
      return this.construirResultado(
        precioCapCana,
        distancia,
        'Cap Cana',
        'Cap Cana',
        TiposViajeTarifa.INTERNO_CAP_CANA,
        persistir,
      );
    }

    if (dto.origenNombre?.trim() && dto.destinoNombre?.trim()) {
      const od = await this.tarifaRepository.obtenerTarifaActiva(
        dto.origenNombre.trim(),
        dto.destinoNombre.trim(),
      );
      if (od) {
        return new EstimacionTarifaResultado(
          od.precio,
          distancia,
          od.id,
          TiposViajeTarifa.EXTERNO,
        );
      }
    }

    const C = MENSAJES.EXCEPCIONES.CONFIGURACION;
    const tarifaBase = await this.obtenerParametroNumerico(C.CLAVE_TARIFA_BASE);
    const precioPorKm = await this.obtenerParametroNumerico(C.CLAVE_TARIFA_KM);
    const tarifaMinima = await this.obtenerParametroNumerico(
      C.CLAVE_TARIFA_MINIMA,
    );

    let precio = tarifaBase + distancia * precioPorKm;
    precio = Math.max(precio, tarifaMinima);
    precio = Math.round(precio * 100) / 100;

    return this.construirResultado(
      precio,
      distancia,
      `${dto.origenLat},${dto.origenLng}`,
      `${dto.destinoLat},${dto.destinoLng}`,
      TiposViajeTarifa.EXTERNO,
      persistir,
    );
  }

  /** BR-TAR-001: ambos puntos en Cap Cana → tarifa plana; si no aplica → null. */
  private async intentarTarifaPlanaCapCana(
    dto: EstimarTarifaDto,
  ): Promise<number | null> {
    const C = MENSAJES.EXCEPCIONES.CONFIGURACION;
    const geocercaConfig = await this.configRepo.obtenerPorClave(
      C.CLAVE_GEOCERCA_CAP_CANA,
    );
    if (!geocercaConfig) {
      throw new DomainException(C.NO_DEFINIDA(C.CLAVE_GEOCERCA_CAP_CANA), 503);
    }

    const geocerca = parsearGeocercaBbox(geocercaConfig.valor);
    if (!geocerca) {
      throw new DomainException(C.GEOCERCA_CAP_CANA_INVALIDA, 503);
    }

    const origenDentro = puntoEnGeocercaBbox(
      dto.origenLat,
      dto.origenLng,
      geocerca,
    );
    const destinoDentro = puntoEnGeocercaBbox(
      dto.destinoLat,
      dto.destinoLng,
      geocerca,
    );

    if (!origenDentro || !destinoDentro) {
      return null;
    }

    return this.obtenerParametroNumerico(C.CLAVE_TARIFA_ZONA_CAP_CANA);
  }

  private async construirResultado(
    precio: number,
    distancia: number,
    origen: string,
    destino: string,
    tipoViaje: TiposViajeTarifa,
    persistir: boolean,
  ): Promise<EstimacionTarifaResultado> {
    const tarifa = Tarifa.crear({ origen, destino, precio });

    if (persistir) {
      const guardada = await this.tarifaRepository.guardar(tarifa);
      return new EstimacionTarifaResultado(
        guardada.precio,
        distancia,
        guardada.id,
        tipoViaje,
      );
    }

    return new EstimacionTarifaResultado(
      tarifa.precio,
      distancia,
      tarifa.id,
      tipoViaje,
    );
  }

  private async obtenerParametroNumerico(clave: string): Promise<number> {
    const config = await this.configRepo.obtenerPorClave(clave);
    if (!config) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONFIGURACION.NO_DEFINIDA(clave),
        503,
      );
    }

    const valor = Number(config.valor);
    if (!Number.isFinite(valor) || valor < 0) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONFIGURACION.VALOR_NUMERICO_INVALIDO(clave),
        503,
      );
    }

    return valor;
  }
}
