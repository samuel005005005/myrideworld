import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { EstimarTarifaDto } from '../dto/estimar-tarifa.dto.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';

@Injectable()
export class EstimarTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async ejecutar(dto: EstimarTarifaDto, persistir = false): Promise<Tarifa> {
    const distancia = calcularDistanciaKm(
      dto.origenLat,
      dto.origenLng,
      dto.destinoLat,
      dto.destinoLng,
    );

    const tarifaBase = Number(
      await this.configRepo.obtenerValor('TARIFA_BASE', '30.0'),
    );
    const precioPorKm = Number(
      await this.configRepo.obtenerValor('TARIFA_KM', '15.0'),
    );
    const tarifaMinima = Number(
      await this.configRepo.obtenerValor('TARIFA_MINIMA', '50.0'),
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
      return await this.tarifaRepository.guardar(tarifa);
    }

    return tarifa;
  }
}
