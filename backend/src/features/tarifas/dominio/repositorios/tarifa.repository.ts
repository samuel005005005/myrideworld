import { Tarifa } from '../entidades/tarifa.entity.js';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';

export interface ITarifaRepository {
  obtenerPorId(id: string): Promise<Tarifa | null>;
  obtenerTarifaActiva(origen: string, destino: string): Promise<Tarifa | null>;
  listar(estado?: EstadosTarifa): Promise<Tarifa[]>;
  guardar(tarifa: Tarifa): Promise<Tarifa>;
}

export const TARIFA_REPOSITORY = Symbol('ITarifaRepository');
