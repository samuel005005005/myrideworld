import { apiRequest } from '../../../core/http/api-request';
import type { AdminRol } from '../../../core/auth/admin-rol';
import type { AdministradorItem } from '../domain/administrador-item';

export interface CrearAdministradorPayload {
  nombreCompleto: string;
  email: string;
  password: string;
  rolAdmin: AdminRol;
}

export interface ActualizarAdministradorPayload {
  nombreCompleto?: string;
  rolAdmin?: AdminRol;
  password?: string;
  activo?: boolean;
}

export async function listarAdministradores(): Promise<AdministradorItem[]> {
  return apiRequest<AdministradorItem[]>('/api/administradores');
}

export async function crearAdministrador(
  payload: CrearAdministradorPayload,
): Promise<AdministradorItem> {
  return apiRequest<AdministradorItem>('/api/administradores', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function actualizarAdministrador(
  id: string,
  payload: ActualizarAdministradorPayload,
): Promise<AdministradorItem> {
  return apiRequest<AdministradorItem>(`/api/administradores/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
