import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decoradores/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.rol) {
      throw new ForbiddenException('Rol de usuario no encontrado');
    }
    
    const tieneRol = requiredRoles.includes(user.rol);
    if (!tieneRol) {
      throw new ForbiddenException(`Se requiere rol ${requiredRoles.join(' o ')} para acceder a este recurso`);
    }
    
    return true;
  }
}
