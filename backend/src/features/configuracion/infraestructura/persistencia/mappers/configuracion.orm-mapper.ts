import { Configuracion } from '../../../dominio/entidades/configuracion.entity.js';
import { ConfiguracionOrmEntity } from '../entidades/configuracion.orm-entity.js';

export class ConfiguracionOrmMapper {
  static toDomain(entity: ConfiguracionOrmEntity): Configuracion {
    return Configuracion.crear({
      id: entity.id,
      clave: entity.clave,
      valor: entity.valor,
      descripcion: entity.descripcion,
      actualizadoEn: entity.actualizadoEn,
    });
  }

  static toOrm(domain: Configuracion): Partial<ConfiguracionOrmEntity> {
    return {
      id: domain.id,
      clave: domain.clave,
      valor: domain.valor,
      descripcion: domain.descripcion,
      actualizadoEn: domain.actualizadoEn,
    };
  }
}
