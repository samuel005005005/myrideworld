import { apiRequest } from '../../../core/http/api-request';
import type { ViajeListItem } from '../domain/viaje-list-item';

export interface FiltrosViajesAdmin {
  estado?: string;
  desde?: string;
  hasta?: string;
}

export async function listarViajesAdmin(
  filtros?: FiltrosViajesAdmin,
): Promise<ViajeListItem[]> {
  const params = new URLSearchParams();
  if (filtros?.estado) params.set('estado', filtros.estado);
  if (filtros?.desde) params.set('desde', filtros.desde);
  if (filtros?.hasta) params.set('hasta', filtros.hasta);
  const q = params.toString();
  return apiRequest<ViajeListItem[]>(`/api/viajes${q ? `?${q}` : ''}`);
}

export async function obtenerViajeAdmin(id: string): Promise<ViajeListItem> {
  return apiRequest<ViajeListItem>(`/api/viajes/${id}`);
}
