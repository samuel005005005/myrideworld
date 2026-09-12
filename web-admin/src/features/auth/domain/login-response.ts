import type { AdminRol } from '../../../core/auth/admin-rol';

export interface LoginResponse {
  token: string;
  adminRol?: AdminRol;
  nombreCompleto?: string;
}
