import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AdminRol } from './admin-rol';
import {
  navItemsParaRol,
  puedeEscribirSeccion,
  primeraRutaPermitida,
} from './rbac';
import type { SeccionAdmin } from './seccion-admin';
import { SessionStorage } from './session-storage';
import { loginAdmin } from '../../features/auth/infrastructure/auth-api';

interface AuthContextValue {
  token: string | null;
  adminRol: AdminRol | null;
  nombreCompleto: string | null;
  autenticado: boolean;
  primeraRuta: string;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
  puedeEscribir: (seccion: SeccionAdmin) => boolean;
  navItems: ReturnType<typeof navItemsParaRol>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    SessionStorage.obtenerToken(),
  );
  const [adminRol, setAdminRol] = useState<AdminRol | null>(() =>
    SessionStorage.obtenerAdminRol(),
  );
  const [nombreCompleto, setNombreCompleto] = useState<string | null>(() =>
    SessionStorage.obtenerNombreCompleto(),
  );

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const respuesta = await loginAdmin(email, password);
    const rol = respuesta.adminRol ?? 'SUPER_ADMIN';
    const nombre = respuesta.nombreCompleto ?? email;

    SessionStorage.guardarSesion({
      token: respuesta.token,
      adminRol: rol,
      nombreCompleto: nombre,
    });

    setToken(respuesta.token);
    setAdminRol(rol);
    setNombreCompleto(nombre);
  }, []);

  const cerrarSesion = useCallback(() => {
    SessionStorage.limpiar();
    setToken(null);
    setAdminRol(null);
    setNombreCompleto(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      adminRol,
      nombreCompleto,
      autenticado: Boolean(token && adminRol),
      primeraRuta: primeraRutaPermitida(adminRol),
      iniciarSesion,
      cerrarSesion,
      puedeEscribir: (seccion: SeccionAdmin) =>
        puedeEscribirSeccion(adminRol, seccion),
      navItems: navItemsParaRol(adminRol),
    }),
    [token, adminRol, nombreCompleto, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
