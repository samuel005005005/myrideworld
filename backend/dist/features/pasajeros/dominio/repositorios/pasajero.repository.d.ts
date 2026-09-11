import { Pasajero } from '../entidades/pasajero.entity.js';
export interface IPasajeroRepository {
    obtenerPorId(id: string): Promise<Pasajero | null>;
    obtenerPorEmail(email: string): Promise<Pasajero | null>;
    guardar(pasajero: Pasajero): Promise<Pasajero>;
}
export declare const PASAJERO_REPOSITORY: unique symbol;
