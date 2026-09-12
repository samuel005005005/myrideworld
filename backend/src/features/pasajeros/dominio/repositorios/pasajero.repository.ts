import { Pasajero } from '../entidades/pasajero.entity.js';

export interface IPasajeroRepository {
  obtenerPorId(id: string): Promise<Pasajero | null>;
  obtenerPorEmail(email: string): Promise<Pasajero | null>;
  listar(busqueda?: string): Promise<Pasajero[]>;
  guardar(pasajero: Pasajero): Promise<Pasajero>;
}

export const PASAJERO_REPOSITORY = Symbol('IPasajeroRepository');
