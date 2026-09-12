import { envConfig } from '../config/env.config';
import { SessionStorage } from '../auth/session-storage';
import { ApiError } from './api-error';

interface CabecerasHttp {
  [clave: string]: string;
}

function extraerMensaje(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const mensaje = (data as { message: unknown }).message;
    if (typeof mensaje === 'string') {
      return mensaje;
    }
    if (Array.isArray(mensaje) && mensaje.length > 0) {
      return String(mensaje[0]);
    }
  }
  return fallback;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers: CabecerasHttp = {
    'Content-Type': 'application/json',
    ...(init.headers as CabecerasHttp | undefined),
  };

  const token = SessionStorage.obtenerToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${envConfig.apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  if (respuesta.status === 204) {
    return undefined as T;
  }

  const data: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ApiError(
      extraerMensaje(data, `Error HTTP ${respuesta.status}`),
      respuesta.status,
    );
  }

  return data as T;
}
