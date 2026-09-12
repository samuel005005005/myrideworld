import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IHasheadorPassword } from './hasheador-password.port.js';

@Injectable()
export class BcryptHasheadorPassword implements IHasheadorPassword {
  private readonly rondas = 10;

  async hashear(textoPlano: string): Promise<string> {
    return bcrypt.hash(textoPlano, this.rondas);
  }

  async comparar(textoPlano: string, hash: string): Promise<boolean> {
    return bcrypt.compare(textoPlano, hash);
  }
}
