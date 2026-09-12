import { Inject, Injectable } from '@nestjs/common';
import type { IConfiguracionRepository } from '../../dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../dominio/repositorios/configuracion.repository.js';
import { Configuracion } from '../../dominio/entidades/configuracion.entity.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { ActualizarConfiguracionDto } from '../dto/actualizar-configuracion.dto.js';

@Injectable()
export class ActualizarConfiguracionUseCase {
  constructor(
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async ejecutar(
    clave: string,
    dto: ActualizarConfiguracionDto,
  ): Promise<Configuracion> {
    const existente = await this.configRepo.obtenerPorClave(clave);
    if (!existente) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONFIGURACION.NO_ENCONTRADA,
        404,
      );
    }

    existente.actualizarValor(dto.valor);
    return this.configRepo.guardar(existente);
  }
}
