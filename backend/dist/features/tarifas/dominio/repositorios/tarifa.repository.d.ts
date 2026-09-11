import { Tarifa } from '../entidades/tarifa.entity.js';
export interface ITarifaRepository {
    obtenerPorId(id: string): Promise<Tarifa | null>;
    obtenerTarifaActiva(origen: string, destino: string): Promise<Tarifa | null>;
    guardar(tarifa: Tarifa): Promise<Tarifa>;
}
export declare const TARIFA_REPOSITORY: unique symbol;
