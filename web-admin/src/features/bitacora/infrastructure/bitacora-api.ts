import { apiRequest } from '../../../core/http/api-request';
import type { BitacoraItem } from '../domain/bitacora-item';

export interface FiltrosBitacora {
  desde?: string;
  hasta?: string;
  servicio?: string;
  accion?: string;
}

function armarQuery(filtros: FiltrosBitacora): string {
  const params = new URLSearchParams();
  if (filtros.desde) {
    params.set('desde', filtros.desde);
  }
  if (filtros.hasta) {
    params.set('hasta', filtros.hasta);
  }
  if (filtros.servicio?.trim()) {
    params.set('servicio', filtros.servicio.trim());
  }
  if (filtros.accion?.trim()) {
    params.set('accion', filtros.accion.trim());
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function listarBitacora(
  filtros: FiltrosBitacora = {},
): Promise<BitacoraItem[]> {
  return apiRequest<BitacoraItem[]>(`/api/bitacora${armarQuery(filtros)}`);
}
