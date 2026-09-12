import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ADMIN_ROLES, type AdminRol } from '../../../../core/auth/admin-rol';
import { etiquetaRol } from '../../../../core/auth/rbac';
import { ApiError } from '../../../../core/http/api-error';
import type { AdministradorItem } from '../../domain/administrador-item';
import {
  actualizarAdministrador,
  crearAdministrador,
  listarAdministradores,
} from '../../infrastructure/administradores-api';

export function UsuariosAdminPage() {
  const [items, setItems] = useState<AdministradorItem[]>([]);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolAdmin, setRolAdmin] = useState<AdminRol>('OPERACIONES');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function onCrear(event: FormEvent) {
    event.preventDefault();
    setProcesando('crear');
    setError(null);
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

      {error ? <p className="error-text">{error}</p> : null}

      <form className="inline-form stacked" onSubmit={onCrear}>
        <input
          placeholder="Nombre completo"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
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
        <button type="submit" disabled={procesando === 'crear'}>
          {procesando === 'crear' ? '…' : 'Crear usuario'}
        </button>
      </form>

      {cargando ? (
        <p>Cargando…</p>
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
                  <td colSpan={6}>Sin administradores</td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombreCompleto}</td>
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
                    <td>{a.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>{new Date(a.fechaRegistro).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
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
