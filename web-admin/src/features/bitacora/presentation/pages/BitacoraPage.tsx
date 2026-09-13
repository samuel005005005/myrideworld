import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../../core/http/api-error';
import type { BitacoraItem } from '../../domain/bitacora-item';
import { listarBitacora } from '../../infrastructure/bitacora-api';

function badgeServicio(servicio: string) {
  return <span className="badge badge-info">{servicio}</span>;
}

function badgeAccion(accion: string) {
  const lower = accion.toLowerCase();
  if (
    lower.includes('crear') ||
    lower.includes('completar') ||
    lower.includes('aprobar')
  ) {
    return <span className="badge badge-ok">{accion}</span>;
  }
  if (
    lower.includes('cancel') ||
    lower.includes('rechaz') ||
    lower.includes('suspend') ||
    lower.includes('eliminar')
  ) {
    return <span className="badge badge-danger">{accion}</span>;
  }
  if (lower.includes('actualiz') || lower.includes('editar')) {
    return <span className="badge badge-warn">{accion}</span>;
  }
  return <span className="badge">{accion}</span>;
}

export function BitacoraPage() {
  const [items, setItems] = useState<BitacoraItem[]>([]);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [servicio, setServicio] = useState('');
  const [accion, setAccion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setItems(
        await listarBitacora({
          desde: desde || undefined,
          hasta: hasta || undefined,
          servicio: servicio || undefined,
          accion: accion || undefined,
        }),
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo cargar la bitácora',
      );
    } finally {
      setCargando(false);
    }
  }, [desde, hasta, servicio, accion]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Bitácora</h1>
          <p className="muted">
            Auditoría de acciones del sistema
            {!cargando ? ` · ${items.length} evento${items.length === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <button type="button" className="chip" onClick={() => void cargar()}>
          Actualizar
        </button>
      </header>

      <div className="filters filters-form">
        <label>
          Desde
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </label>
        <label>
          Hasta
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </label>
        <label>
          Servicio
          <input
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            placeholder="Ej. viajes"
          />
        </label>
        <label>
          Acción
          <input
            value={accion}
            onChange={(e) => setAccion(e.target.value)}
            placeholder="Ej. completar"
          />
        </label>
        <button
          type="button"
          className="chip active"
          onClick={() => void cargar()}
        >
          Filtrar
        </button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {cargando ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Acción</th>
                <th>Usuario</th>
                <th>Detalle</th>
                <th>Entidad</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    Sin eventos con esos filtros
                  </td>
                </tr>
              ) : (
                items.map((b) => (
                  <tr key={b.id}>
                    <td>{new Date(b.fecha).toLocaleString()}</td>
                    <td>{badgeServicio(b.servicioSistema)}</td>
                    <td>{badgeAccion(b.accion)}</td>
                    <td>
                      <strong>{b.usuario}</strong>
                      {b.ip ? (
                        <div className="muted cell-sub">{b.ip}</div>
                      ) : null}
                    </td>
                    <td className="detalle-cell" title={b.detalle}>
                      {b.detalle || <span className="muted">—</span>}
                    </td>
                    <td>
                      {b.entidadId ? (
                        <code title={b.entidadId}>
                          {b.entidadId.slice(0, 8)}
                        </code>
                      ) : (
                        <span className="muted">—</span>
                      )}
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
