import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { SesionesActivasRegistry } from '../seguridad/sesiones-activas.registry.js';
import type { JwtClaims } from '../seguridad/jwt-claims.js';
import { MENSAJES } from '../constantes/mensajes.const.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private sesionesActivas: SesionesActivasRegistry,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(MENSAJES.EXCEPCIONES.AUTH.TOKEN_AUSENTE);
    }

    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtClaims>(token, {
        secret,
      });
      if (!this.sesionesActivas.esVigente(payload.sub, payload.sid)) {
        throw new UnauthorizedException(
          MENSAJES.EXCEPCIONES.AUTH.SESION_OTRO_DISPOSITIVO,
        );
      }
      (request as Request & { user: JwtClaims }).user = payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
