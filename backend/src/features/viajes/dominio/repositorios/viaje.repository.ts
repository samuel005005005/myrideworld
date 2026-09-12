import { Viaje } from '../entidades/viaje.entity.js';

export interface IViajeRepository {
  obtenerPorId(id: string): Promise<Viaje | null>;
  obtenerPorPasajero(pasajeroId: string): Promise<Viaje[]>;
  obtenerPorConductor(conductorId: string): Promise<Viaje[]>;
  guardar(viaje: Viaje): Promise<Viaje>;
  listar(filtros?: { pasajeroId?: string; conductorId?: string; limite?: number }): Promise<Viaje[]>;
  obtenerViajesVencidos(minutos: number): Promise<Viaje[]>;
  /** Asigna conductor solo si el viaje sigue disponible (evita carrera). */
  aceptarSiDisponible(viajeId: string, conductorId: string): Promise<Viaje | null>;
}

export const VIAJE_REPOSITORY = Symbol('IViajeRepository');
