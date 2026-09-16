import type { AdminRol } from './admin-rol';
import type { SeccionAdmin } from './seccion-admin';

export interface NavItem {
  path: string;
  label: string;
  seccion: SeccionAdmin;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', seccion: 'dashboard' },
  { path: '/flota', label: 'Flota', seccion: 'flota' },
  { path: '/tarifario', label: 'Tarifario', seccion: 'tarifario' },
  { path: '/viajes', label: 'Viajes', seccion: 'viajes' },
  { path: '/balances', label: 'Balances', seccion: 'balances' },
  { path: '/bitacora', label: 'Bitácora', seccion: 'bitacora' },
  { path: '/usuarios-admin', label: 'Usuarios admin', seccion: 'usuarios-admin' },
  { path: '/configuracion', label: 'Configuración', seccion: 'configuracion' },
] as const;

const LECTURA_POR_ROL: { readonly [K in AdminRol]: readonly SeccionAdmin[] } = {
  SUPER_ADMIN: [
    'dashboard',
    'flota',
    'tarifario',
    'viajes',
    'balances',
    'bitacora',
    'usuarios-admin',
    'configuracion',
  ],
  OPERACIONES: ['dashboard', 'flota', 'viajes', 'configuracion'],
  FINANZAS: ['tarifario', 'balances', 'configuracion'],
  AUDITOR: ['dashboard', 'flota', 'viajes', 'balances', 'bitacora'],
};

const ESCRITURA_POR_ROL: { readonly [K in AdminRol]: readonly SeccionAdmin[] } = {
  SUPER_ADMIN: [
    'flota',
    'tarifario',
    'viajes',
    'balances',
    'bitacora',
    'usuarios-admin',
    'configuracion',
  ],
  OPERACIONES: ['flota', 'viajes', 'configuracion'],
  FINANZAS: ['tarifario', 'balances', 'configuracion'],
  AUDITOR: [],
};

const CLAVES_CONFIG_OPERACIONES = new Set([
  'TIMEOUT_VIAJE_MINUTOS',
  'TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS',
  'RADIO_PROXIMIDAD_ORIGEN_M',
  'RADIO_PROXIMIDAD_DESTINO_M',
  'SOPORTE_TELEFONO',
  'SOPORTE_WHATSAPP',
]);

const CLAVES_CONFIG_FINANZAS = new Set([
  'FEE_PLATAFORMA',
  'TARIFA_BASE',
  'TARIFA_KM',
  'TARIFA_MINIMA',
  'TARIFA_ZONA_CAP_CANA',
  'GEOCERCA_CAP_CANA',
]);

export function puedeLeerSeccion(
  rol: AdminRol | null,
  seccion: SeccionAdmin,
): boolean {
  if (!rol) {
    return false;
  }
  return LECTURA_POR_ROL[rol].includes(seccion);
}

export function puedeEscribirSeccion(
  rol: AdminRol | null,
  seccion: SeccionAdmin,
): boolean {
  if (!rol) {
    return false;
  }
  return ESCRITURA_POR_ROL[rol].includes(seccion);
}

export function navItemsParaRol(rol: AdminRol | null): NavItem[] {
  if (!rol) {
    return [];
  }
  return NAV_ITEMS.filter((item) => puedeLeerSeccion(rol, item.seccion));
}

export function primeraRutaPermitida(rol: AdminRol | null): string {
  const items = navItemsParaRol(rol);
  return items[0]?.path ?? '/login';
}

export function filtrarClavesConfigPorRol(
  rol: AdminRol | null,
  claves: readonly string[],
): string[] {
  if (!rol) {
    return [];
  }
  if (rol === 'SUPER_ADMIN') {
    return [...claves];
  }
  if (rol === 'OPERACIONES') {
    return claves.filter((c) => CLAVES_CONFIG_OPERACIONES.has(c));
  }
  if (rol === 'FINANZAS') {
    return claves.filter((c) => CLAVES_CONFIG_FINANZAS.has(c));
  }
  return [...claves];
}

export function puedeEditarClaveConfig(
  rol: AdminRol | null,
  clave: string,
): boolean {
  if (!rol || !puedeEscribirSeccion(rol, 'configuracion')) {
    return false;
  }
  if (rol === 'SUPER_ADMIN') {
    return true;
  }
  if (rol === 'OPERACIONES') {
    return CLAVES_CONFIG_OPERACIONES.has(clave);
  }
  if (rol === 'FINANZAS') {
    return CLAVES_CONFIG_FINANZAS.has(clave);
  }
  return false;
}

export function etiquetaRol(rol: AdminRol): string {
  const etiquetas: { readonly [K in AdminRol]: string } = {
    SUPER_ADMIN: 'Super admin',
    OPERACIONES: 'Operaciones',
    FINANZAS: 'Finanzas',
    AUDITOR: 'Auditor',
  };
  return etiquetas[rol];
}
