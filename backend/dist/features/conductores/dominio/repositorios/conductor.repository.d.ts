import { Conductor } from '../entidades/conductor.entity.js';
export interface IConductorRepository {
    obtenerPorId(id: string): Promise<Conductor | null>;
    obtenerPorEmail(email: string): Promise<Conductor | null>;
    obtenerDisponibles(): Promise<Conductor[]>;
    guardar(conductor: Conductor): Promise<Conductor>;
}
export declare const CONDUCTOR_REPOSITORY: unique symbol;
