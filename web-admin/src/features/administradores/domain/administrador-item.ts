import type { AdminRol } from '../../../core/auth/admin-rol';

export interface AdministradorItem {
  id: string;
  nombreCompleto: string;
  email: string;
  rolAdmin: AdminRol;
  activo: boolean;
  fechaRegistro: string;
}
