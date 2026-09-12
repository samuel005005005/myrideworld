import { Configuracion } from '../../dominio/entidades/configuracion.entity.js';
import { ConfiguracionResponseDto } from '../dto/configuracion-response.dto.js';

export class ConfiguracionMapper {
  static toResponse(configuracion: Configuracion): ConfiguracionResponseDto {
    return {
      id: configuracion.id,
      clave: configuracion.clave,
      valor: configuracion.valor,
      descripcion: configuracion.descripcion,
      actualizadoEn: configuracion.actualizadoEn,
    };
  }
}
