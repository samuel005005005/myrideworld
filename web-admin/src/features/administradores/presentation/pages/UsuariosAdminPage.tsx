import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { ADMIN_ROLES, type AdminRol } from '../../../../core/auth/admin-rol';
import { etiquetaRol } from '../../../../core/auth/rbac';
import { ApiError } from '../../../../core/http/api-error';
import type { AdministradorItem } from '../../domain/administrador-item';
import {
  actualizarAdministrador,
  crearAdministrador,
  listarAdministradores,
} from '../../infrastructure/administradores-api';

function badgeActivo(activo: boolean) {
  return activo ? (
    <span className="badge badge-ok">Activo</span>
  ) : (
    <span className="badge">Inactivo</span>
  );
}

export function UsuariosAdminPage() {
  const [items, setItems] = useState<AdministradorItem[]>([]);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolAdmin, setRolAdmin] = useState<AdminRol>('OPERACIONES');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setItems(await listarAdministradores());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudieron cargar los administradores',
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const resumen = useMemo(() => {
    let activos = 0;
    for (const a of items) {
      if (a.activo) activos += 1;
    }
    return { total: items.length, activos, inactivos: items.length - activos };
  }, [items]);

  async function onCrear(event: FormEvent) {
    event.preventDefault();
    setProcesando('crear');
    setError(null);
    setOkMsg(null);
    try {
      await crearAdministrador({
        nombreCompleto: nombreCompleto.trim(),
        email: email.trim(),
        password,
        rolAdmin,
      });
      setNombreCompleto('');
      setEmail('');
      setPassword('');
      setOkMsg('Usuario admin creado');
      await cargar();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo crear el administrador',
      );
    } finally {
      setProcesando(null);
    }
  }

  async function toggleActivo(admin: AdministradorItem) {
    setProcesando(admin.id);
    setError(null);
    setOkMsg(null);
    try {
      await actualizarAdministrador(admin.id, { activo: !admin.activo });
      await cargar();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo actualizar el administrador',
      );
    } finally {
      setProcesando(null);
    }
  }

  async function cambiarRol(admin: AdministradorItem, nuevoRol: AdminRol) {
    if (nuevoRol === admin.rolAdmin) {
      return;
    }
    setProcesando(admin.id);
    setError(null);
    setOkMsg(null);
    try {
      await actualizarAdministrador(admin.id, { rolAdmin: nuevoRol });
      await cargar();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo cambiar el rol',
      );
    } finally {
      setProcesando(null);
    }
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Usuarios admin</h1>
          <p className="muted">Gestión de cuentas (solo SUPER_ADMIN)</p>
        </div>
        <button type="button" className="chip" onClick={() => void cargar()}>
          Actualizar
        </button>
      </header>

      {!cargando && items.length > 0 ? (
        <div className="stats-grid stats-grid-compact">
          <article className="stat-card">
            <span className="stat-label">Total</span>
            <strong className="stat-value">{resumen.total}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Activos</span>
            <strong className="stat-value">{resumen.activos}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Inactivos</span>
            <strong className="stat-value">{resumen.inactivos}</strong>
          </article>
        </div>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}
      {okMsg ? <p className="ok-text">{okMsg}</p> : null}

      <form className="tarifario-form" onSubmit={onCrear}>
        <div className="alta-conductor-grid">
          <label className="zona-field">
            <span>Nombre completo</span>
            <input
              placeholder="Nombre y apellido"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
          </label>
          <label className="zona-field">
            <span>Correo</span>
            <input
              type="email"
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="zona-field">
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="Mín. 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <label className="zona-field">
            <span>Rol</span>
            <select
              value={rolAdmin}
              onChange={(e) => setRolAdmin(e.target.value as AdminRol)}
            >
              {ADMIN_ROLES.map((rol) => (
                <option key={rol} value={rol}>
                  {etiquetaRol(rol)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={procesando === 'crear'}
        >
          {procesando === 'crear' ? '…' : 'Crear usuario'}
        </button>
      </form>

      {cargando ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    Sin administradores
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.nombreCompleto}</strong>
                    </td>
                    <td>{a.email}</td>
                    <td>
                      <select
                        value={a.rolAdmin}
                        disabled={procesando === a.id}
                        onChange={(e) =>
                          void cambiarRol(a, e.target.value as AdminRol)
                        }
                      >
                        {ADMIN_ROLES.map((rol) => (
                          <option key={rol} value={rol}>
                            {etiquetaRol(rol)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{badgeActivo(a.activo)}</td>
                    <td>{new Date(a.fechaRegistro).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className={
                          a.activo ? 'btn-secondary' : 'btn-primary'
                        }
                        disabled={procesando === a.id}
                        onClick={() => void toggleActivo(a)}
                      >
                        {procesando === a.id
                          ? '…'
                          : a.activo
                            ? 'Desactivar'
                            : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
