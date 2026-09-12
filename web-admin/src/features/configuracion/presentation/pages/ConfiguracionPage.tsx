import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../core/auth/auth-provider';
import {
  filtrarClavesConfigPorRol,
  puedeEditarClaveConfig,
} from '../../../../core/auth/rbac';
import { ApiError } from '../../../../core/http/api-error';
import type { ConfiguracionItem } from '../../domain/configuracion-item';
import {
  actualizarConfiguracion,
  listarConfiguraciones,
} from '../../infrastructure/configuracion-api';

export function ConfiguracionPage() {
  const { adminRol, puedeEscribir } = useAuth();
  const puedeEditarConfig = puedeEscribir('configuracion');

  const [items, setItems] = useState<ConfiguracionItem[]>([]);
  const [valores, setValores] = useState<{ [clave: string]: string }>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const lista = await listarConfiguraciones();
      const clavesPermitidas = filtrarClavesConfigPorRol(
        adminRol,
        lista.map((i) => i.clave),
      );
      const filtrada = lista.filter((item) =>
        clavesPermitidas.includes(item.clave),
      );
      setItems(filtrada);
      const mapa: { [clave: string]: string } = {};
      for (const item of filtrada) {
        mapa[item.clave] = item.valor;
      }
      setValores(mapa);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo cargar la configuración',
      );
    } finally {
      setCargando(false);
    }
  }, [adminRol]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function guardar(clave: string) {
    const valor = valores[clave]?.trim();
    if (!valor) {
      setError('El valor no puede estar vacío');
      return;
    }
    setGuardando(clave);
    setError(null);
    setOk(null);
    try {
      const actualizado = await actualizarConfiguracion(clave, valor);
      setItems((prev) =>
        prev.map((item) => (item.clave === clave ? actualizado : item)),
      );
      setOk(`${clave} actualizado`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo guardar el valor',
      );
    } finally {
      setGuardando(null);
    }
  }

  if (cargando) {
    return <p>Cargando configuración…</p>;
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Configuración</h1>
          <p className="muted">
            Tarifas, fees, timeouts y contactos de soporte
            {!puedeEditarConfig ? ' (solo lectura)' : ''}
          </p>
        </div>
      </header>
      {error ? <p className="error-text">{error}</p> : null}
      {ok ? <p className="ok-text">{ok}</p> : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Clave</th>
              <th>Descripción</th>
              <th>Valor</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4}>Sin parámetros visibles para su rol</td>
              </tr>
            ) : (
              items.map((item) => {
                const editable =
                  puedeEditarConfig &&
                  puedeEditarClaveConfig(adminRol, item.clave);
                return (
                  <tr key={item.id}>
                    <td>
                      <code>{item.clave}</code>
                    </td>
                    <td>{item.descripcion}</td>
                    <td>
                      <input
                        value={valores[item.clave] ?? ''}
                        readOnly={!editable}
                        onChange={(e) =>
                          setValores((prev) => ({
                            ...prev,
                            [item.clave]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      {editable ? (
                        <button
                          type="button"
                          disabled={guardando === item.clave}
                          onClick={() => void guardar(item.clave)}
                        >
                          {guardando === item.clave ? '…' : 'Guardar'}
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
