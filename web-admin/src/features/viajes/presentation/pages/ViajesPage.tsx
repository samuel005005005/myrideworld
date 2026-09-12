import { useCallback, useEffect, useState } from 'react';
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

export function ViajesPage() {
  const [items, setItems] = useState<ViajeListItem[]>([]);
  const [estado, setEstado] = useState<(typeof ESTADOS)[number]>('Todos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [detalle, setDetalle] = useState<ViajeListItem | null>(null);
  const [cargando, setCargando] = useState(true);
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

  async function verDetalle(id: string) {
    setError(null);
    try {
      setDetalle(await obtenerViajeAdmin(id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo cargar el detalle',
      );
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Viajes</h1>
        <button type="button" className="chip" onClick={() => void cargar()}>
          Actualizar
        </button>
      </header>

      <div className="filters filters-form">
        <label>
          Estado
          <select
            value={estado}
            onChange={(e) =>
              setEstado(e.target.value as (typeof ESTADOS)[number])
            }
          >
            {ESTADOS.map((op) => (
              <option key={op} value={op}>
                {op}
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
        <p>Cargando…</p>
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
                  <td colSpan={7}>Sin viajes</td>
                </tr>
              ) : (
                items.map((v) => (
                  <tr key={v.id}>
                    <td>{v.estado}</td>
                    <td>US${Number(v.tarifaEstimada).toFixed(2)}</td>
                    <td>{new Date(v.fechaSolicitud).toLocaleString()}</td>
                    <td>
                      <code>{v.pasajeroId.slice(0, 8)}</code>
                    </td>
                    <td>
                      <code>
                        {v.conductorId ? v.conductorId.slice(0, 8) : '—'}
                      </code>
                    </td>
                    <td className="coords">
                      {v.origenLat.toFixed(3)},{v.origenLng.toFixed(3)} →{' '}
                      {v.destinoLat.toFixed(3)},{v.destinoLng.toFixed(3)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="chip"
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
            <h2>Viaje {detalle.id.slice(0, 8)}</h2>
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
            <dd>{detalle.estado}</dd>
            <dt>Tarifa</dt>
            <dd>US${Number(detalle.tarifaEstimada).toFixed(2)}</dd>
            <dt>Solicitud</dt>
            <dd>{new Date(detalle.fechaSolicitud).toLocaleString()}</dd>
            <dt>Inicio</dt>
            <dd>
              {detalle.fechaInicio
                ? new Date(detalle.fechaInicio).toLocaleString()
                : '—'}
            </dd>
            <dt>Fin</dt>
            <dd>
              {detalle.fechaFin
                ? new Date(detalle.fechaFin).toLocaleString()
                : '—'}
            </dd>
            <dt>Pasajero</dt>
            <dd>
              <code>{detalle.pasajeroId}</code>
            </dd>
            <dt>Conductor</dt>
            <dd>
              <code>{detalle.conductorId ?? '—'}</code>
            </dd>
          </dl>
        </div>
      ) : null}
    </section>
  );
}
