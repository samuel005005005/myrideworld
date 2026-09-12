import { PagoBalance } from '../../dominio/entidades/pago-balance.entity.js';
import { PagoBalanceResponseDto } from '../dto/pago-balance-response.dto.js';

export class PagoBalanceMapper {
  static toResponse(pago: PagoBalance): PagoBalanceResponseDto {
    return {
      id: pago.id,
      viajeId: pago.viajeId,
      conductorId: pago.conductorId,
      montoBruto: pago.montoBruto,
      feeProcesamiento: pago.feeProcesamiento,
      montoNeto: pago.montoNeto,
      metodo: pago.metodo,
      fecha: pago.fecha,
    };
  }
}
