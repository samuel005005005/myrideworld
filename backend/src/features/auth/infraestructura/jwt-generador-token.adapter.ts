import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IGeneradorToken } from '../aplicacion/puertos/generador-token.port.js';

@Injectable()
export class JwtGeneradorToken implements IGeneradorToken {
  constructor(private readonly jwtService: JwtService) {}

  async firmar(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
