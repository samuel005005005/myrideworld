export const GENERADOR_TOKEN = Symbol('GENERADOR_TOKEN');

export interface IGeneradorToken {
  firmar(payload: Record<string, unknown>): Promise<string>;
}
