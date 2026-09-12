import { Viaje } from '../entidades/viaje.entity.js';

export interface IViajeRepository {
  obtenerPorId(id: string): Promise<Viaje | null>;
  obtenerPorPasajero(pasajeroId: string): Promise<Viaje[]>;
  obtenerPorConductor(conductorId: string): Promise<Viaje[]>;
  guardar(viaje: Viaje): Promise<Viaje>;
  listar(filtros?: {
    pasajeroId?: string;
    conductorId?: string;
    limite?: number;
    estado?: string;
    desde?: Date;
    hasta?: Date;
  }): Promise<Viaje[]>;
  obtenerViajesVencidos(minutos: number): Promise<Viaje[]>;
  /** Asigna conductor solo si el viaje sigue disponible (evita carrera). */
  aceptarSiDisponible(viajeId: string, conductorId: string): Promise<Viaje | null>;
  contarPorEstados(estados: string[]): Promise<number>;
  contarCompletadosDesde(desde: Date): Promise<number>;
}

export const VIAJE_REPOSITORY = Symbol('IViajeRepository');
