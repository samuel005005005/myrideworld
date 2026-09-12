import { apiRequest } from '../../../core/http/api-request';
import type { LoginResponse } from '../domain/login-response';

export async function loginAdmin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rol: 'ADMIN' }),
  });
}
