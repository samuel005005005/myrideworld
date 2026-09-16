import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { SesionesActivasRegistry } from '../seguridad/sesiones-activas.registry.js';
import type { JwtClaims } from '../seguridad/jwt-claims.js';
import { MENSAJES } from '../constantes/mensajes.const.js';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private sesionesActivas: SesionesActivasRegistry,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      this.logger.warn(
        `Intento de conexión a Sockets sin token (Socket ID: ${client.id})`,
      );
      throw new WsException('No autorizado');
    }

    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtClaims>(token, {
        secret,
      });
      if (!this.sesionesActivas.esVigente(payload.sub, payload.sid)) {
        throw new WsException(MENSAJES.EXCEPCIONES.AUTH.SESION_OTRO_DISPOSITIVO);
      }
      (client as Socket & { user: JwtClaims }).user = payload;
      return true;
    } catch (err) {
      if (err instanceof WsException) {
        throw err;
      }
      this.logger.warn(`Token inválido en Sockets (Socket ID: ${client.id})`);
      throw new WsException('Token inválido o expirado');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
