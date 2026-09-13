import { Inject, Injectable } from '@nestjs/common';
import type { IZonaTarifaRepository } from '../../dominio/repositorios/zona-tarifa.repository.js';
import { ZONA_TARIFA_REPOSITORY } from '../../dominio/repositorios/zona-tarifa.repository.js';
import { ZonaTarifa } from '../../dominio/entidades/zona-tarifa.entity.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class CrearZonaTarifaUseCase {
  constructor(
    @Inject(ZONA_TARIFA_REPOSITORY)
    private readonly repo: IZonaTarifaRepository,
  ) {}

  async ejecutar(nombre: string): Promise<ZonaTarifa> {
    const normalizado = nombre.trim();
    if (!normalizado) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.TARIFAS.ORIGEN_DESTINO_OBLIGATORIOS,
      );
    }

    const existe = await this.repo.obtenerPorNombre(normalizado);
    if (existe) {
      throw new DomainException(MENSAJES.EXCEPCIONES.TARIFAS.ZONA_DUPLICADA);
    }

    return this.repo.guardar(
      ZonaTarifa.crear({ nombre: normalizado, activa: true }),
    );
  }
}
