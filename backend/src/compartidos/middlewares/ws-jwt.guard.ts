import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      this.logger.warn(`Intento de conexión a Sockets sin token (Socket ID: ${client.id})`);
      throw new WsException('No autorizado');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET', 'super-secret-key');
      const payload = await this.jwtService.verifyAsync(token, { secret });
      // Inyectamos el payload en el socket para que esté disponible en los eventos
      (client as any).user = payload;
      return true;
    } catch (err) {
      this.logger.warn(`Token inválido en Sockets (Socket ID: ${client.id})`);
      throw new WsException('Token inválido o expirado');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    // 1. Intento por handshake auth { token: "..." }
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }
    // 2. Intento por header Authorization "Bearer ..."
    const [type, token] = client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
