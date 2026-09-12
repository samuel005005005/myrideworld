import type { AdminRol } from './admin-rol';
import { esAdminRol } from './admin-rol';

const TOKEN_KEY = 'myride_admin_token';
const ROL_KEY = 'myride_admin_rol';
const NOMBRE_KEY = 'myride_admin_nombre';

export interface SesionAdmin {
  token: string;
  adminRol: AdminRol;
  nombreCompleto: string;
}

export class SessionStorage {
  static obtenerToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  static obtenerAdminRol(): AdminRol | null {
    const rol = sessionStorage.getItem(ROL_KEY);
    return esAdminRol(rol) ? rol : null;
  }

  static obtenerNombreCompleto(): string | null {
    return sessionStorage.getItem(NOMBRE_KEY);
  }

  static guardarSesion(sesion: SesionAdmin): void {
    sessionStorage.setItem(TOKEN_KEY, sesion.token);
    sessionStorage.setItem(ROL_KEY, sesion.adminRol);
    sessionStorage.setItem(NOMBRE_KEY, sesion.nombreCompleto);
  }

  static limpiar(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ROL_KEY);
    sessionStorage.removeItem(NOMBRE_KEY);
  }
}
