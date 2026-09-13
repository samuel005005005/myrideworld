import { ZonaTarifa } from '../entidades/zona-tarifa.entity.js';

export interface IZonaTarifaRepository {
  obtenerPorId(id: string): Promise<ZonaTarifa | null>;
  obtenerPorNombre(nombre: string): Promise<ZonaTarifa | null>;
  listar(soloActivas?: boolean): Promise<ZonaTarifa[]>;
  guardar(zona: ZonaTarifa): Promise<ZonaTarifa>;
}

export const ZONA_TARIFA_REPOSITORY = Symbol('IZonaTarifaRepository');
