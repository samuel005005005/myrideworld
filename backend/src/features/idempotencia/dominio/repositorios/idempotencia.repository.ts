import { Idempotencia } from '../entidades/idempotencia.entity.js';

export interface IIdempotenciaRepository {
  obtenerPorLlave(llave: string): Promise<Idempotencia | null>;
  guardar(idempotencia: Idempotencia): Promise<Idempotencia>;
}

export const IDEMPOTENCIA_REPOSITORY = Symbol('IIdempotenciaRepository');
