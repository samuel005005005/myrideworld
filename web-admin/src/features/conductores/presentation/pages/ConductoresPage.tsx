import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../core/auth/auth-provider';
import { envConfig } from '../../../../core/config/env.config';
import { ApiError } from '../../../../core/http/api-error';
import type { ConductorListItem } from '../../domain/conductor-list-item';
import {
  aprobarConductor,
  listarConductores,
  reactivarConductor,
  rechazarConductor,
  suspenderConductor,
} from '../../infrastructure/conductores-api';

type FiltroEstado =
  | 'Todos'
  | 'Pendiente'
  | 'Aprobado'
  | 'Rechazado'
  | 'Suspendido';

const FILTROS: readonly FiltroEstado[] = [
  'Todos',
  'Pendiente',
  'Aprobado',
  'Rechazado',
  'Suspendido',
] as const;

function urlDocumento(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizado = path.replace(/^\.\//, '').replace(/^\/+/, '');
  return `${envConfig.apiBaseUrl}/${normalizado}`;
}

function linkDoc(url: string | null | undefined, label: string) {
  const href = urlDocumento(url);
  if (!href) return <span className="muted">—</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export function ConductoresPage() {
  const { puedeEscribir } = useAuth();
  const puedeEditar = puedeEscribir('flota');

  const [items, setItems] = useState<ConductorListItem[]>([]);
  const [filtro, setFiltro] = useState<FiltroEstado>('Todos');
  const [detalle, setDetalle] = useState<ConductorListItem | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const estado = filtro === 'Todos' ? undefined : filtro;
      setItems(await listarConductores(estado));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudieron cargar los conductores',
      );
    } finally {
      setCargando(false);
    }
  }, [filtro]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function ejecutarAccion(
    id: string,
    accion: 'aprobar' | 'rechazar' | 'suspender' | 'reactivar',
  ) {
    setProcesando(id);
    setError(null);
    try {
      if (accion === 'aprobar') {
        await aprobarConductor(id);
      } else if (accion === 'rechazar') {
        await rechazarConductor(id);
      } else if (accion === 'suspender') {
        await suspenderConductor(id);
      } else {
        await reactivarConductor(id);
      }
      await cargar();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo completar la acción',
      );
    } finally {
      setProcesando(null);
    }
  }

  function renderAcciones(c: ConductorListItem) {
    if (!puedeEditar) {
      return '—';
    }

    const ocupado = procesando === c.id;
    const estado = c.estadoAprobacion;

    if (estado === 'Pendiente') {
      return (
        <div className="row-actions">
          <button
            type="button"
            disabled={ocupado}
            onClick={() => void ejecutarAccion(c.id, 'aprobar')}
          >
            {ocupado ? '…' : 'Aprobar'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={ocupado}
            onClick={() => void ejecutarAccion(c.id, 'rechazar')}
          >
            Rechazar
          </button>
        </div>
      );
    }

    if (estado === 'Aprobado') {
      return (
        <button
          type="button"
          className="btn-secondary"
          disabled={ocupado}
          onClick={() => void ejecutarAccion(c.id, 'suspender')}
        >
          {ocupado ? '…' : 'Suspender'}
        </button>
      );
    }

    if (estado === 'Suspendido') {
      return (
        <button
          type="button"
          disabled={ocupado}
          onClick={() => void ejecutarAccion(c.id, 'reactivar')}
        >
          {ocupado ? '…' : 'Reactivar'}
        </button>
      );
    }

    return '—';
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Flota</h1>
          <p className="muted">
            Conductores registrados
            {!puedeEditar ? ' (solo lectura)' : ''}
          </p>
        </div>
        <div className="filters">
          {FILTROS.map((opcion) => (
            <button
              key={opcion}
              type="button"
              className={filtro === opcion ? 'chip active' : 'chip'}
              onClick={() => setFiltro(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </header>
      {error ? <p className="error-text">{error}</p> : null}
      {cargando ? (
        <p>Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Aprobación</th>
                <th>Disponibilidad</th>
                <th>Docs</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7}>Sin conductores</td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombreCompleto}</td>
                    <td>{c.email}</td>
                    <td>{c.telefono}</td>
                    <td>{c.estadoAprobacion}</td>
                    <td>{c.estadoDisponibilidad}</td>
                    <td>
                      <button
                        type="button"
                        className="chip"
                        onClick={() => setDetalle(c)}
                      >
                        Ver
                      </button>
                    </td>
                    <td>{renderAcciones(c)}</td>
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
            <h2>{detalle.nombreCompleto}</h2>
            <button
              type="button"
              className="chip"
              onClick={() => setDetalle(null)}
            >
              Cerrar
            </button>
          </header>
          <p>
            Placa: <strong>{detalle.vehiculoPlaca ?? '—'}</strong>
          </p>
          <ul className="doc-links">
            <li>Foto: {linkDoc(detalle.fotoUrl, 'abrir')}</li>
            <li>Licencia: {linkDoc(detalle.licenciaUrl, 'abrir')}</li>
            <li>Seguro: {linkDoc(detalle.seguroUrl, 'abrir')}</li>
          </ul>
        </div>
      ) : null}
    </section>
  );
}
