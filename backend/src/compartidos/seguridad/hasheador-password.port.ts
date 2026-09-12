export const HASHEADOR_PASSWORD = Symbol('HASHEADOR_PASSWORD');

export interface IHasheadorPassword {
  hashear(textoPlano: string): Promise<string>;
  comparar(textoPlano: string, hash: string): Promise<boolean>;
}
