import { apiRequest } from '../../../core/http/api-request';
import type { LiquidacionResumen } from '../domain/liquidacion-resumen';
import type { PagoBalanceItem } from '../domain/pago-balance-item';

export interface FiltrosBalances {
  conductorId?: string;
  desde?: string;
  hasta?: string;
}

function armarQuery(filtros: FiltrosBalances): string {
  const params = new URLSearchParams();
  if (filtros.conductorId?.trim()) {
    params.set('conductorId', filtros.conductorId.trim());
  }
  if (filtros.desde) {
    params.set('desde', filtros.desde);
  }
  if (filtros.hasta) {
    params.set('hasta', filtros.hasta);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function listarBalancesAdmin(
  filtros: FiltrosBalances = {},
): Promise<PagoBalanceItem[]> {
  return apiRequest<PagoBalanceItem[]>(
    `/api/pagos-balances${armarQuery(filtros)}`,
  );
}

export async function obtenerLiquidacion(
  filtros: Pick<FiltrosBalances, 'desde' | 'hasta'> = {},
): Promise<LiquidacionResumen> {
  return apiRequest<LiquidacionResumen>(
    `/api/pagos-balances/liquidacion${armarQuery(filtros)}`,
  );
}
