import { Inject, Injectable } from '@nestjs/common';
import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { TARIFA_REPOSITORY } from '../../dominio/repositorios/tarifa.repository.js';
import type { IZonaTarifaRepository } from '../../dominio/repositorios/zona-tarifa.repository.js';
import { ZONA_TARIFA_REPOSITORY } from '../../dominio/repositorios/zona-tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import { CrearTarifaDto } from '../dto/crear-actualizar-tarifa.dto.js';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class CrearTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
    @Inject(ZONA_TARIFA_REPOSITORY)
    private readonly zonaRepository: IZonaTarifaRepository,
  ) {}

  async ejecutar(dto: CrearTarifaDto): Promise<Tarifa> {
    const origen = dto.origen.trim();
    const destino = dto.destino.trim();
    await this.asegurarZonaActiva(origen);
    await this.asegurarZonaActiva(destino);

    const tarifa = Tarifa.crear({
      origen,
      destino,
      precio: dto.precio,
      estado: EstadosTarifa.ACTIVO,
    });
    return this.tarifaRepository.guardar(tarifa);
  }

  private async asegurarZonaActiva(nombre: string): Promise<void> {
    const zona = await this.zonaRepository.obtenerPorNombre(nombre);
    if (!zona || !zona.activa) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.TARIFAS.ZONA_NO_ENCONTRADA(nombre),
      );
    }
  }
}
