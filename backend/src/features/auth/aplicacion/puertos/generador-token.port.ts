import type { JwtClaims } from '../../../../compartidos/seguridad/jwt-claims.js';

export const GENERADOR_TOKEN = Symbol('GENERADOR_TOKEN');

export interface IGeneradorToken {
  firmar(payload: JwtClaims): Promise<string>;
}
