import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import { ActualizarTarifaDto } from '../dto/crear-actualizar-tarifa.dto.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class ActualizarTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async ejecutar(id: string, dto: ActualizarTarifaDto): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.obtenerPorId(id);
    if (!tarifa) {
      throw new DomainException(MENSAJES.EXCEPCIONES.TARIFAS.NO_ENCONTRADA, 404);
    }

    tarifa.actualizar({
      origen: dto.origen?.trim(),
      destino: dto.destino?.trim(),
      precio: dto.precio,
      estado: dto.estado,
    });

    return this.tarifaRepository.guardar(tarifa);
  }
}
