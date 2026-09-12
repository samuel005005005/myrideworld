import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLES_KEY } from '../decoradores/admin-roles.decorator.js';
import { RolesAdmin } from '../constantes/roles-admin.enum.js';
import { Roles } from '../constantes/roles.enum.js';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolesAdmin[]>(
      ADMIN_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.rol !== Roles.ADMIN) {
      throw new ForbiddenException('Se requiere rol ADMIN');
    }

    const adminRol = user.adminRol as RolesAdmin | undefined;
    if (!adminRol) {
      throw new ForbiddenException('Perfil de administrador no encontrado');
    }

    if (adminRol === RolesAdmin.SUPER_ADMIN) {
      return true;
    }

    if (!requiredRoles.includes(adminRol)) {
      throw new ForbiddenException(
        `Se requiere perfil admin ${requiredRoles.join(' o ')}`,
      );
    }

    return true;
  }
}
