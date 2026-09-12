import { apiRequest } from '../../../core/http/api-request';
import type { ConfiguracionItem } from '../domain/configuracion-item';

export async function listarConfiguraciones(): Promise<ConfiguracionItem[]> {
  return apiRequest<ConfiguracionItem[]>('/api/configuracion');
}

export async function actualizarConfiguracion(
  clave: string,
  valor: string,
): Promise<ConfiguracionItem> {
  return apiRequest<ConfiguracionItem>(
    `/api/configuracion/${encodeURIComponent(clave)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ valor }),
    },
  );
}
