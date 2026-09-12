import { Inject, Injectable } from '@nestjs/common';
import type { IConfiguracionRepository } from '../../dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../dominio/repositorios/configuracion.repository.js';
import { Configuracion } from '../../dominio/entidades/configuracion.entity.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const CLAVES_PUBLICAS = new Set([
  MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_SOPORTE_TELEFONO,
  MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_SOPORTE_WHATSAPP,
]);

@Injectable()
export class ListarConfiguracionesPublicasUseCase {
  constructor(
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configuracionRepository: IConfiguracionRepository,
  ) {}

  async ejecutar(): Promise<Configuracion[]> {
    const todas = await this.configuracionRepository.listar();
    return todas.filter((item) => CLAVES_PUBLICAS.has(item.clave));
  }
}
