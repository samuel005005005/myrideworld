import { Configuracion } from '../entidades/configuracion.entity.js';

export interface IConfiguracionRepository {
  obtenerValor(clave: string, defaultValue: string): Promise<string>;
  obtenerPorClave(clave: string): Promise<Configuracion | null>;
  listar(): Promise<Configuracion[]>;
  guardar(configuracion: Configuracion): Promise<Configuracion>;
}

export const CONFIGURACION_REPOSITORY = Symbol('IConfiguracionRepository');
