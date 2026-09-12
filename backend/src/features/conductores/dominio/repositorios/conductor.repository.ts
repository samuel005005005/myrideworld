import { Conductor } from '../entidades/conductor.entity.js';
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';

export interface IConductorRepository {
  obtenerPorId(id: string): Promise<Conductor | null>;
  obtenerPorEmail(email: string): Promise<Conductor | null>;
  obtenerDisponibles(): Promise<Conductor[]>;
  /** Conductores conectados dentro de un bounding box aproximado al radio. */
  obtenerDisponiblesCercanos(
    lat: number,
    lng: number,
    radioKm: number,
  ): Promise<Conductor[]>;
  guardar(conductor: Conductor): Promise<Conductor>;
  listar(filtros?: { estadoAprobacion?: EstadosConductor }): Promise<Conductor[]>;
  contarPorDisponibilidad(
    estadoDisponibilidad: string,
  ): Promise<number>;
}

export const CONDUCTOR_REPOSITORY = Symbol('IConductorRepository');
