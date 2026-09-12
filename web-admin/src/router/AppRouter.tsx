import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../core/auth/auth-provider';
import { puedeLeerSeccion } from '../core/auth/rbac';
import type { SeccionAdmin } from '../core/auth/seccion-admin';
import { LoginPage } from '../features/auth/presentation/pages/LoginPage';
import { UsuariosAdminPage } from '../features/administradores/presentation/pages/UsuariosAdminPage';
import { BalancesPage } from '../features/balances/presentation/pages/BalancesPage';
import { BitacoraPage } from '../features/bitacora/presentation/pages/BitacoraPage';
import { ConfiguracionPage } from '../features/configuracion/presentation/pages/ConfiguracionPage';
import { ConductoresPage } from '../features/conductores/presentation/pages/ConductoresPage';
import { DashboardPage } from '../features/dashboard/presentation/pages/DashboardPage';
import { TarifarioPage } from '../features/tarifas/presentation/pages/TarifarioPage';
import { ViajesPage } from '../features/viajes/presentation/pages/ViajesPage';
import { AdminShell } from '../shared/components/AdminShell';

function RutaProtegida({ children }: { children: ReactNode }) {
  const { autenticado } = useAuth();
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RutaPorRol({
  seccion,
  children,
}: {
  seccion: SeccionAdmin;
  children: ReactNode;
}) {
  const { adminRol, primeraRuta } = useAuth();
  if (!puedeLeerSeccion(adminRol, seccion)) {
    return <Navigate to={primeraRuta} replace />;
  }
  return children;
}

function RutaInicio() {
  const { primeraRuta } = useAuth();
  return <Navigate to={primeraRuta} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RutaProtegida>
            <AdminShell />
          </RutaProtegida>
        }
      >
        <Route index element={<RutaInicio />} />
        <Route
          path="dashboard"
          element={
            <RutaPorRol seccion="dashboard">
              <DashboardPage />
            </RutaPorRol>
          }
        />
        <Route
          path="flota"
          element={
            <RutaPorRol seccion="flota">
              <ConductoresPage />
            </RutaPorRol>
          }
        />
        <Route path="conductores" element={<Navigate to="/flota" replace />} />
        <Route
          path="tarifario"
          element={
            <RutaPorRol seccion="tarifario">
              <TarifarioPage />
            </RutaPorRol>
          }
        />
        <Route
          path="viajes"
          element={
            <RutaPorRol seccion="viajes">
              <ViajesPage />
            </RutaPorRol>
          }
        />
        <Route
          path="balances"
          element={
            <RutaPorRol seccion="balances">
              <BalancesPage />
            </RutaPorRol>
          }
        />
        <Route
          path="bitacora"
          element={
            <RutaPorRol seccion="bitacora">
              <BitacoraPage />
            </RutaPorRol>
          }
        />
        <Route
          path="usuarios-admin"
          element={
            <RutaPorRol seccion="usuarios-admin">
              <UsuariosAdminPage />
            </RutaPorRol>
          }
        />
        <Route
          path="configuracion"
          element={
            <RutaPorRol seccion="configuracion">
              <ConfiguracionPage />
            </RutaPorRol>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
