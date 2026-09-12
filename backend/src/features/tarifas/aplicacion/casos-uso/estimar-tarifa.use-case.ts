import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';

import { EstimarTarifaDto } from '../dto/estimar-tarifa.dto.js';
@Injectable()
export class EstimarTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async ejecutar(dto: EstimarTarifaDto): Promise<Tarifa> {
    // Cálculo simulado de distancia usando coordenadas (Pitágoras simple para MVP)
    const deltaLat = dto.destinoLat - dto.origenLat;
    const deltaLng = dto.destinoLng - dto.origenLng;
    // 1 grado es aproximadamente 111 km
    const distancia = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) * 111;

    // Valores dinámicos consultados a la base de datos
    const tarifaBase = Number(await this.configRepo.obtenerValor('TARIFA_BASE', '30.0'));
    const precioPorKm = Number(await this.configRepo.obtenerValor('TARIFA_KM', '15.0'));
    const tarifaMinima = Number(await this.configRepo.obtenerValor('TARIFA_MINIMA', '50.0'));

    let precio = tarifaBase + (distancia * precioPorKm);

    // Mínimo definido
    precio = Math.max(precio, tarifaMinima);
    // Redondear a 2 decimales
    precio = Math.round(precio * 100) / 100;

    const tarifa = Tarifa.crear({
      origen: `${dto.origenLat},${dto.origenLng}`,
      destino: `${dto.destinoLat},${dto.destinoLng}`,
      precio: precio,
    });

    return await this.tarifaRepository.guardar(tarifa);
  }
}
