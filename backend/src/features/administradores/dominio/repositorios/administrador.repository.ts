import { Administrador } from '../entidades/administrador.entity.js';

export interface IAdministradorRepository {
  obtenerPorId(id: string): Promise<Administrador | null>;
  obtenerPorEmail(email: string): Promise<Administrador | null>;
  listar(): Promise<Administrador[]>;
  guardar(administrador: Administrador): Promise<Administrador>;
}

export const ADMINISTRADOR_REPOSITORY = Symbol('IAdministradorRepository');
