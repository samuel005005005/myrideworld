import { SetMetadata } from '@nestjs/common';
import { RolesAdmin } from '../constantes/roles-admin.enum.js';

export const ADMIN_ROLES_KEY = 'adminRoles';
export const AdminRoles = (...roles: RolesAdmin[]) =>
  SetMetadata(ADMIN_ROLES_KEY, roles);
