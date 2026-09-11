import { Configuracion } from '../entidades/configuracion.entity.js';

export interface IConfiguracionRepository {
  obtenerValor(clave: string, defaultValue: string): Promise<string>;
  guardar(configuracion: Configuracion): Promise<Configuracion>;
}

export const CONFIGURACION_REPOSITORY = Symbol('IConfiguracionRepository');
