import { Bitacora } from '../entidades/bitacora.entity.js';

export interface IBitacoraRepository {
  guardar(bitacora: Bitacora): Promise<Bitacora>;
}

export const BITACORA_REPOSITORY = Symbol('IBitacoraRepository');
