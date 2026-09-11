import { Viaje } from '../entidades/viaje.entity.js';
export interface IViajeRepository {
    obtenerPorId(id: string): Promise<Viaje | null>;
    obtenerPorPasajero(pasajeroId: string): Promise<Viaje[]>;
    obtenerPorConductor(conductorId: string): Promise<Viaje[]>;
    guardar(viaje: Viaje): Promise<Viaje>;
    listar(filtros?: {
        pasajeroId?: string;
        conductorId?: string;
    }): Promise<Viaje[]>;
}
export declare const VIAJE_REPOSITORY: unique symbol;
