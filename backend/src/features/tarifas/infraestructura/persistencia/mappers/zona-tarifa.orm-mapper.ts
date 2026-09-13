import { ZonaTarifa } from '../../../dominio/entidades/zona-tarifa.entity.js';
import { ZonaTarifaOrmEntity } from '../entidades/zona-tarifa.orm-entity.js';

export class ZonaTarifaOrmMapper {
  static toDomain(entity: ZonaTarifaOrmEntity): ZonaTarifa {
    return ZonaTarifa.crear({
      id: entity.id,
      nombre: entity.nombre,
      activa: entity.activa,
      fechaRegistro: entity.fechaRegistro,
    });
  }

  static toOrm(zona: ZonaTarifa): Partial<ZonaTarifaOrmEntity> {
    return {
      id: zona.id,
      nombre: zona.nombre,
      activa: zona.activa,
      fechaRegistro: zona.fechaRegistro,
    };
  }
}
