import { apiRequest } from '../../../core/http/api-request';
import type { ConductorListItem } from '../domain/conductor-list-item';
import type { CrearConductorPayload } from '../domain/crear-conductor-payload';

export async function listarConductores(
  estado?: string,
): Promise<ConductorListItem[]> {
  const query = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  return apiRequest<ConductorListItem[]>(`/api/conductores${query}`);
}

export async function crearConductor(
  payload: CrearConductorPayload,
): Promise<ConductorListItem> {
  return apiRequest<ConductorListItem>('/api/conductores', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
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

export async function subirDocumentosConductor(
  id: string,
  archivos: {
    fotoPerfil?: File | null;
    licencia?: File | null;
    seguro?: File | null;
  },
): Promise<ConductorListItem> {
  const form = new FormData();
  if (archivos.fotoPerfil) {
    form.append('fotoPerfil', archivos.fotoPerfil);
  }
  if (archivos.licencia) {
    form.append('licencia', archivos.licencia);
  }
  if (archivos.seguro) {
    form.append('seguro', archivos.seguro);
  }
  return apiRequest<ConductorListItem>(`/api/conductores/${id}/documentos`, {
    method: 'POST',
    body: form,
  });
}
