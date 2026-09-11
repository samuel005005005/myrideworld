import { Viaje } from '../entidades/viaje.entity.js';

export interface IViajeRepository {
  obtenerPorId(id: string): Promise<Viaje | null>;
  obtenerPorPasajero(pasajeroId: string): Promise<Viaje[]>;
  obtenerPorConductor(conductorId: string): Promise<Viaje[]>;
  guardar(viaje: Viaje): Promise<Viaje>;
}

export const VIAJE_REPOSITORY = Symbol('IViajeRepository');
