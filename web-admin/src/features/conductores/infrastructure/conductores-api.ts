import { apiRequest } from '../../../core/http/api-request';
import type { ConductorListItem } from '../domain/conductor-list-item';

export async function listarConductores(
  estado?: string,
): Promise<ConductorListItem[]> {
  const query = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  return apiRequest<ConductorListItem[]>(`/api/conductores${query}`);
}

export async function aprobarConductor(
  id: string,
): Promise<ConductorListItem> {
  return apiRequest<ConductorListItem>(`/api/conductores/${id}/aprobar`, {
    method: 'PATCH',
  });
}

export async function rechazarConductor(
  id: string,
): Promise<ConductorListItem> {
  return apiRequest<ConductorListItem>(`/api/conductores/${id}/rechazar`, {
    method: 'PATCH',
  });
}

export async function suspenderConductor(
  id: string,
): Promise<ConductorListItem> {
  return apiRequest<ConductorListItem>(`/api/conductores/${id}/suspender`, {
    method: 'PATCH',
  });
}

export async function reactivarConductor(
  id: string,
): Promise<ConductorListItem> {
  return apiRequest<ConductorListItem>(`/api/conductores/${id}/reactivar`, {
    method: 'PATCH',
  });
}
