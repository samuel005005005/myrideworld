import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../core/auth/auth-provider';
import { etiquetaRol } from '../../core/auth/rbac';

export function AdminShell() {
  const { cerrarSesion, navItems, nombreCompleto, adminRol } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">MyRide Admin</div>
        {nombreCompleto && adminRol ? (
          <div className="admin-user">
            <strong>{nombreCompleto}</strong>
            <span>{etiquetaRol(adminRol)}</span>
          </div>
        ) : null}
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
