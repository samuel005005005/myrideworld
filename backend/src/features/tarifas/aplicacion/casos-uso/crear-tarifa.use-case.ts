import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import { CrearTarifaDto } from '../dto/crear-actualizar-tarifa.dto.js';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';

@Injectable()
export class CrearTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async ejecutar(dto: CrearTarifaDto): Promise<Tarifa> {
    const tarifa = Tarifa.crear({
      origen: dto.origen.trim(),
      destino: dto.destino.trim(),
      precio: dto.precio,
      estado: EstadosTarifa.ACTIVO,
    });
    return this.tarifaRepository.guardar(tarifa);
  }
}
