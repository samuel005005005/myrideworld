import { Calificacion } from '../entidades/calificacion.entity.js';
export interface ICalificacionRepository {
    guardar(calificacion: Calificacion): Promise<Calificacion>;
    existeCalificacion(viajeId: string): Promise<boolean>;
}
export declare const CALIFICACION_REPOSITORY: unique symbol;
