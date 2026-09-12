export type AdminRol =
  | 'SUPER_ADMIN'
  | 'OPERACIONES'
  | 'FINANZAS'
  | 'AUDITOR';

export const ADMIN_ROLES: readonly AdminRol[] = [
  'SUPER_ADMIN',
  'OPERACIONES',
  'FINANZAS',
  'AUDITOR',
] as const;

export function esAdminRol(valor: string | null | undefined): valor is AdminRol {
  return ADMIN_ROLES.includes(valor as AdminRol);
}
