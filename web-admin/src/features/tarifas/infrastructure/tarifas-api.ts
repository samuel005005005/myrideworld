import { apiRequest } from '../../../core/http/api-request';
import type { EstadoTarifa, TarifaItem } from '../domain/tarifa-item';
import type { ZonaTarifaItem } from '../domain/zona-tarifa-item';

export interface CrearTarifaPayload {
  origen: string;
  destino: string;
  precio: number;
}

export interface ActualizarTarifaPayload {
  origen?: string;
  destino?: string;
  precio?: number;
  estado?: EstadoTarifa;
}

export async function listarTarifas(): Promise<TarifaItem[]> {
  return apiRequest<TarifaItem[]>('/api/tarifas');
}

export async function listarZonasTarifa(): Promise<ZonaTarifaItem[]> {
  return apiRequest<ZonaTarifaItem[]>('/api/tarifas/zonas');
}

export async function crearZonaTarifa(nombre: string): Promise<ZonaTarifaItem> {
  return apiRequest<ZonaTarifaItem>('/api/tarifas/zonas', {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  });
}

export async function crearTarifa(
  payload: CrearTarifaPayload,
): Promise<TarifaItem> {
  return apiRequest<TarifaItem>('/api/tarifas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function actualizarTarifa(
  id: string,
  payload: ActualizarTarifaPayload,
): Promise<TarifaItem> {
  return apiRequest<TarifaItem>(`/api/tarifas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
