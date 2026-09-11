import { PagoBalance } from '../../../dominio/entidades/pago-balance.entity.js';
import { PagoBalanceOrmEntity } from '../entidades/pago-balance.orm-entity.js';

export class PagoBalanceOrmMapper {
  static toDomain(entity: PagoBalanceOrmEntity): PagoBalance {
    return PagoBalance.crear({
      id: entity.id,
      viajeId: entity.viajeId,
      conductorId: entity.conductorId,
      montoBruto: Number(entity.montoBruto),
      feeProcesamiento: Number(entity.feeProcesamiento),
      montoNeto: Number(entity.montoNeto),
      metodo: entity.metodo,
      fecha: entity.fecha,
    });
  }

  static toOrm(pago: PagoBalance): Partial<PagoBalanceOrmEntity> {
    return {
      id: pago.id,
      viajeId: pago.viajeId,
      conductorId: pago.conductorId,
      montoBruto: pago.montoBruto,
      feeProcesamiento: pago.feeProcesamiento,
      montoNeto: pago.montoNeto,
      metodo: pago.metodo,
    };
  }
}
