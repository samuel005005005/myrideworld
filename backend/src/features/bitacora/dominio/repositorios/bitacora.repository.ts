import { Bitacora } from '../entidades/bitacora.entity.js';

export interface FiltrosBitacora {
  desde?: Date;
  hasta?: Date;
  servicio?: string;
  accion?: string;
  limite?: number;
}

export interface IBitacoraRepository {
  guardar(bitacora: Bitacora): Promise<Bitacora>;
  listar(filtros?: FiltrosBitacora): Promise<Bitacora[]>;
}

export const BITACORA_REPOSITORY = Symbol('IBitacoraRepository');
