import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { EstimarTarifaDto } from '../dto/estimar-tarifa.dto.js';
import { EstimacionTarifaResultado } from '../dto/estimacion-tarifa-resultado.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

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

    if (dto.origenNombre?.trim() && dto.destinoNombre?.trim()) {
      const od = await this.tarifaRepository.obtenerTarifaActiva(
        dto.origenNombre.trim(),
        dto.destinoNombre.trim(),
      );
      if (od) {
        if (persistir) {
          return new EstimacionTarifaResultado(od.precio, distancia, od.id);
        }
        return new EstimacionTarifaResultado(od.precio, distancia, od.id);
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

    const tarifa = Tarifa.crear({
      origen: `${dto.origenLat},${dto.origenLng}`,
      destino: `${dto.destinoLat},${dto.destinoLng}`,
      precio,
    });

    if (persistir) {
      const guardada = await this.tarifaRepository.guardar(tarifa);
      return new EstimacionTarifaResultado(
        guardada.precio,
        distancia,
        guardada.id,
      );
    }

    return new EstimacionTarifaResultado(tarifa.precio, distancia, tarifa.id);
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
