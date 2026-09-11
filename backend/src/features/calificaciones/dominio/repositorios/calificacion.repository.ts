import { Calificacion } from '../entidades/calificacion.entity.js';

export interface ICalificacionRepository {
  guardar(calificacion: Calificacion): Promise<Calificacion>;
  existeCalificacion(viajeId: string): Promise<boolean>;
}

export const CALIFICACION_REPOSITORY = Symbol('ICalificacionRepository');
