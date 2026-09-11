import { Tarifa } from '../../../dominio/entidades/tarifa.entity.js';
import { TarifaOrmEntity } from '../entidades/tarifa.orm-entity.js';
import { EstadosTarifa } from '../../../../../compartidos/constantes/estados-tarifa.enum.js';

export class TarifaOrmMapper {
  static toDomain(entity: TarifaOrmEntity): Tarifa {
    return Tarifa.crear({
      id: entity.id,
      origen: entity.origen,
      destino: entity.destino,
      precio: Number(entity.precio),
      estado: entity.estado as EstadosTarifa,
    });
  }

  static toOrm(tarifa: Tarifa): Partial<TarifaOrmEntity> {
    return {
      id: tarifa.id,
      origen: tarifa.origen,
      destino: tarifa.destino,
      precio: tarifa.precio,
      estado: tarifa.estado,
    };
  }
}
