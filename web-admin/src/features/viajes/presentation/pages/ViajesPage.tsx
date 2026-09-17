import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../../core/http/api-error';
import type { ViajeListItem } from '../../domain/viaje-list-item';
import {
  listarViajesAdmin,
  obtenerViajeAdmin,
} from '../../infrastructure/viajes-api';

const ESTADOS = [
  'Todos',
  'Solicitado',
  'Buscando',
  'Asignado',
  'EnCamino',
  'Llego',
  'EnCurso',
  'Completado',
  'Cancelado',
] as const;

const ACTIVOS = new Set([
  'Solicitado',
  'Buscando',
  'Asignado',
  'EnCamino',
  'Llego',
  'EnCurso',
]);

function badgeEstado(estado: string) {
  if (estado === 'Completado') {
    return <span className="badge badge-ok">{estado}</span>;
  }
  if (estado === 'Cancelado') {
    return <span className="badge badge-danger">{estado}</span>;
  }
  if (estado === 'Solicitado' || estado === 'Buscando') {
    return <span className="badge badge-warn">{estado}</span>;
  }
  if (ACTIVOS.has(estado)) {
    return <span className="badge badge-info">{estado}</span>;
  }
  return <span className="badge">{estado}</span>;
}

function etiquetaPersona(
  nombre: string | null | undefined,
  fallback: string,
) {
  const texto = nombre?.trim();
  if (texto) {
    return texto;
  }
  return <span className="muted">{fallback}</span>;
}

function etiquetaLugar(
  direccion: string | null | undefined,
  lat: number,
  lng: number,
) {
  const texto = direccion?.trim();
  if (texto) {
    return texto;
  }
  return (
    <span className="coords muted">
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </span>
  );
}

export function ViajesPage() {
  const [items, setItems] = useState<ViajeListItem[]>([]);
  const [estado, setEstado] = useState<(typeof ESTADOS)[number]>('Todos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [detalle, setDetalle] = useState<ViajeListItem | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setItems(
        await listarViajesAdmin({
          estado: estado === 'Todos' ? undefined : estado,
          desde: desde || undefined,
          hasta: hasta || undefined,
        }),
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudieron cargar los viajes',
      );
    } finally {
      setCargando(false);
    }
  }, [estado, desde, hasta]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const resumen = useMemo(() => {
    let activos = 0;
    let completados = 0;
    let cancelados = 0;
    let tarifaSum = 0;
    for (const v of items) {
      if (ACTIVOS.has(v.estado)) activos += 1;
      if (v.estado === 'Completado') completados += 1;
      if (v.estado === 'Cancelado') cancelados += 1;
      tarifaSum += Number(v.tarifaEstimada) || 0;
    }
    return {
      total: items.length,
      activos,
      completados,
      cancelados,
      tarifaPromedio: items.length ? tarifaSum / items.length : 0,
    };
  }, [items]);

  async function verDetalle(id: string) {
    setCargandoDetalle(true);
    setError(null);
    try {
      setDetalle(await obtenerViajeAdmin(id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo cargar el detalle',
      );
    } finally {
      setCargandoDetalle(false);
    }
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Viajes</h1>
          <p className="muted">Operación en tiempo casi real (últimos 200)</p>
        </div>
        <button type="button" className="chip" onClick={() => void cargar()}>
          Actualizar
        </button>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <strong>{resumen.total}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Activos</span>
          <strong>{resumen.activos}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completados</span>
          <strong>{resumen.completados}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Cancelados</span>
          <strong>{resumen.cancelados}</strong>
        </div>
      </div>

      <div className="filters filters-form">
        <label>
          Estado
          <select
            value={estado}
            onChange={(e) =>
              setEstado(e.target.value as (typeof ESTADOS)[number])
            }
          >
            {ESTADOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
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
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {cargando ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Tarifa</th>
                <th>Solicitud</th>
                <th>Pasajero</th>
                <th>Conductor</th>
                <th>Origen → Destino</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty">
                    Sin viajes con esos filtros
                  </td>
                </tr>
              ) : (
                items.map((v) => (
                  <tr
                    key={v.id}
                    className={
                      detalle?.id === v.id ? 'row-selected' : undefined
                    }
                    onClick={() => void verDetalle(v.id)}
                  >
                    <td>{badgeEstado(v.estado)}</td>
                    <td className="money">
                      US${Number(v.tarifaEstimada).toFixed(2)}
                    </td>
                    <td>
                      {new Date(v.fechaSolicitud).toLocaleString()}
                    </td>
                    <td>
                      {etiquetaPersona(
                        v.pasajeroNombre ?? v.pasajero?.nombreCompleto,
                        'Sin nombre',
                      )}
                    </td>
                    <td>
                      {etiquetaPersona(
                        v.conductorNombre ?? v.conductor?.nombreCompleto,
                        'Sin asignar',
                      )}
                    </td>
                    <td>
                      <div className="ruta-texto">
                        <div>
                          {etiquetaLugar(
                            v.origenDireccion,
                            v.origenLat,
                            v.origenLng,
                          )}
                        </div>
                        <div className="muted">↓</div>
                        <div>
                          {etiquetaLugar(
                            v.destinoDireccion,
                            v.destinoLat,
                            v.destinoLng,
                          )}
                        </div>
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="chip"
                        disabled={cargandoDetalle}
                        onClick={() => void verDetalle(v.id)}
                      >
                        Detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {detalle ? (
        <div className="detail-panel">
          <header className="page-header">
            <div>
              <h2>
                {etiquetaLugar(
                  detalle.origenDireccion,
                  detalle.origenLat,
                  detalle.origenLng,
                )}{' '}
                →{' '}
                {etiquetaLugar(
                  detalle.destinoDireccion,
                  detalle.destinoLat,
                  detalle.destinoLng,
                )}
              </h2>
              <p className="muted">
                {new Date(detalle.fechaSolicitud).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              className="chip"
              onClick={() => setDetalle(null)}
            >
              Cerrar
            </button>
          </header>
          <dl className="detail-grid">
            <dt>Estado</dt>
            <dd>{badgeEstado(detalle.estado)}</dd>
            <dt>Tarifa</dt>
            <dd className="money">
              US${Number(detalle.tarifaEstimada).toFixed(2)}
            </dd>
            <dt>Solicitud</dt>
            <dd>{new Date(detalle.fechaSolicitud).toLocaleString()}</dd>
            <dt>Inicio</dt>
            <dd>
              {detalle.fechaInicio ? (
                new Date(detalle.fechaInicio).toLocaleString()
              ) : (
                <span className="muted">—</span>
              )}
            </dd>
            <dt>Fin</dt>
            <dd>
              {detalle.fechaFin ? (
                new Date(detalle.fechaFin).toLocaleString()
              ) : (
                <span className="muted">—</span>
              )}
            </dd>
            <dt>Pasajero</dt>
            <dd>
              {etiquetaPersona(
                detalle.pasajeroNombre ?? detalle.pasajero?.nombreCompleto,
                'Sin nombre',
              )}
              {detalle.pasajero?.telefono ? (
                <div className="muted cell-sub">{detalle.pasajero.telefono}</div>
              ) : null}
            </dd>
            <dt>Conductor</dt>
            <dd>
              {etiquetaPersona(
                detalle.conductorNombre ?? detalle.conductor?.nombreCompleto,
                'Sin asignar',
              )}
              {detalle.conductor?.telefono ? (
                <div className="muted cell-sub">{detalle.conductor.telefono}</div>
              ) : null}
            </dd>
            <dt>Origen</dt>
            <dd>
              {etiquetaLugar(
                detalle.origenDireccion,
                detalle.origenLat,
                detalle.origenLng,
              )}
            </dd>
            <dt>Destino</dt>
            <dd>
              {etiquetaLugar(
                detalle.destinoDireccion,
                detalle.destinoLat,
                detalle.destinoLng,
              )}
            </dd>
          </dl>
        </div>
      ) : null}
    </section>
  );
}
