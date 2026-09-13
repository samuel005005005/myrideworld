import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useAuth } from '../../../../core/auth/auth-provider';
import { envConfig } from '../../../../core/config/env.config';
import { ApiError } from '../../../../core/http/api-error';
import type { ConductorListItem } from '../../domain/conductor-list-item';
import {
  aprobarConductor,
  listarConductores,
  reactivarConductor,
  rechazarConductor,
  subirDocumentosConductor,
  suspenderConductor,
} from '../../infrastructure/conductores-api';
import { AltaConductorForm } from '../components/AltaConductorForm';
import { FlotaMapa } from '../components/FlotaMapa';

type FiltroEstado =
  | 'Todos'
  | 'Pendiente'
  | 'Aprobado'
  | 'Rechazado'
  | 'Suspendido';

type FiltroDisponibilidad = 'Todos' | 'Conectado' | 'Ocupado' | 'Desconectado';

const FILTROS_APROBACION: readonly FiltroEstado[] = [
  'Todos',
  'Pendiente',
  'Aprobado',
  'Rechazado',
  'Suspendido',
] as const;

const FILTROS_DISP: readonly FiltroDisponibilidad[] = [
  'Todos',
  'Conectado',
  'Ocupado',
  'Desconectado',
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

function tieneGps(c: ConductorListItem): boolean {
  return (
    typeof c.ultimaUbicacionLat === 'number' &&
    typeof c.ultimaUbicacionLng === 'number' &&
    Number.isFinite(c.ultimaUbicacionLat) &&
    Number.isFinite(c.ultimaUbicacionLng)
  );
}

function badgeDisponibilidad(estado: string) {
  const clase =
    estado === 'Conectado'
      ? 'badge badge-ok'
      : estado === 'Ocupado'
        ? 'badge badge-warn'
        : 'badge';
  return <span className={clase}>{estado}</span>;
}

function badgeAprobacion(estado: string) {
  if (estado === 'Aprobado') return <span className="badge badge-ok">{estado}</span>;
  if (estado === 'Pendiente') return <span className="badge badge-warn">{estado}</span>;
  if (estado === 'Suspendido' || estado === 'Rechazado') {
    return <span className="badge badge-danger">{estado}</span>;
  }
  return <span className="badge">{estado}</span>;
}

export function ConductoresPage() {
  const { puedeEscribir } = useAuth();
  const puedeEditar = puedeEscribir('flota');

  const [items, setItems] = useState<ConductorListItem[]>([]);
  const [filtro, setFiltro] = useState<FiltroEstado>('Todos');
  const [filtroDisp, setFiltroDisp] =
    useState<FiltroDisponibilidad>('Todos');
  const [detalle, setDetalle] = useState<ConductorListItem | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [licenciaFile, setLicenciaFile] = useState<File | null>(null);
  const [seguroFile, setSeguroFile] = useState<File | null>(null);

  const cargar = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setCargando(true);
    }
    setError(null);
    try {
      const lista = await listarConductores();
      setItems(lista);
      setDetalle((prev) => {
        if (!prev) return null;
        return lista.find((c) => c.id === prev.id) ?? prev;
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudieron cargar los conductores',
      );
    } finally {
      if (!silencioso) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }
    const id = window.setInterval(() => {
      void cargar(true);
    }, 15000);
    return () => window.clearInterval(id);
  }, [autoRefresh, cargar]);

  const resumen = useMemo(() => {
    let conectados = 0;
    let ocupados = 0;
    let desconectados = 0;
    let pendientes = 0;
    let enMapa = 0;
    for (const c of items) {
      if (c.estadoDisponibilidad === 'Conectado') conectados += 1;
      if (c.estadoDisponibilidad === 'Ocupado') ocupados += 1;
      if (c.estadoDisponibilidad === 'Desconectado') desconectados += 1;
      if (c.estadoAprobacion === 'Pendiente') pendientes += 1;
      if (tieneGps(c)) enMapa += 1;
    }
    return {
      total: items.length,
      conectados,
      ocupados,
      desconectados,
      pendientes,
      enMapa,
    };
  }, [items]);

  const visibles = useMemo(() => {
    return items.filter((c) => {
      if (filtro !== 'Todos' && c.estadoAprobacion !== filtro) {
        return false;
      }
      if (filtroDisp !== 'Todos' && c.estadoDisponibilidad !== filtroDisp) {
        return false;
      }
      return true;
    });
  }, [items, filtro, filtroDisp]);

  async function ejecutarAccion(
    id: string,
    accion: 'aprobar' | 'rechazar' | 'suspender' | 'reactivar',
  ) {
    setProcesando(id);
    setError(null);
    setOkMsg(null);
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
      await cargar(true);
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

  async function onSubirDocs(event: FormEvent) {
    event.preventDefault();
    if (!detalle || !puedeEditar) {
      return;
    }
    if (!fotoFile && !licenciaFile && !seguroFile) {
      setError('Elegí al menos un archivo (foto, licencia o seguro)');
      return;
    }
    setProcesando(`docs-${detalle.id}`);
    setError(null);
    setOkMsg(null);
    try {
      const actualizado = await subirDocumentosConductor(detalle.id, {
        fotoPerfil: fotoFile,
        licencia: licenciaFile,
        seguro: seguroFile,
      });
      setFotoFile(null);
      setLicenciaFile(null);
      setSeguroFile(null);
      setOkMsg(`Documentos actualizados para ${actualizado.nombreCompleto}`);
      await cargar(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudieron subir los documentos',
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
            Estado actual de la flota
            {!puedeEditar ? ' (solo lectura)' : ''}
            {autoRefresh ? ' · actualiza cada 15s' : ''}
          </p>
        </div>
        <div className="row-actions">
          <label className="chip-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto 15s
          </label>
          <button type="button" className="chip" onClick={() => void cargar()}>
            Actualizar
          </button>
        </div>
      </header>

      <div className="stats-grid stats-grid-flota">
        <button
          type="button"
          className="stat-card stat-card-btn"
          onClick={() => {
            setFiltro('Todos');
            setFiltroDisp('Todos');
          }}
        >
          <span className="stat-label">Total flota</span>
          <strong className="stat-value">{resumen.total}</strong>
        </button>
        <button
          type="button"
          className="stat-card stat-card-btn"
          onClick={() => setFiltroDisp('Conectado')}
        >
          <span className="stat-label">Conectados</span>
          <strong className="stat-value">{resumen.conectados}</strong>
        </button>
        <button
          type="button"
          className="stat-card stat-card-btn"
          onClick={() => setFiltroDisp('Ocupado')}
        >
          <span className="stat-label">Ocupados</span>
          <strong className="stat-value">{resumen.ocupados}</strong>
        </button>
        <button
          type="button"
          className="stat-card stat-card-btn"
          onClick={() => setFiltroDisp('Desconectado')}
        >
          <span className="stat-label">Desconectados</span>
          <strong className="stat-value">{resumen.desconectados}</strong>
        </button>
        <button
          type="button"
          className="stat-card stat-card-btn"
          onClick={() => {
            setFiltro('Pendiente');
            setFiltroDisp('Todos');
          }}
        >
          <span className="stat-label">Pendientes alta</span>
          <strong className="stat-value">{resumen.pendientes}</strong>
        </button>
        <article className="stat-card">
          <span className="stat-label">Con GPS / en mapa</span>
          <strong className="stat-value">{resumen.enMapa}</strong>
        </article>
      </div>

      {puedeEditar ? (
        <AltaConductorForm onCreado={() => cargar(true)} />
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}
      {okMsg ? <p className="ok-text">{okMsg}</p> : null}

      <FlotaMapa
        conductores={visibles}
        seleccionadoId={detalle?.id}
        onSeleccionar={(id) => {
          const c = items.find((x) => x.id === id) ?? null;
          setDetalle(c);
        }}
      />

      <div className="filters" style={{ marginTop: 16 }}>
        <span className="muted">Aprobación:</span>
        {FILTROS_APROBACION.map((opcion) => (
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
      <div className="filters">
        <span className="muted">Disponibilidad:</span>
        {FILTROS_DISP.map((opcion) => (
          <button
            key={opcion}
            type="button"
            className={filtroDisp === opcion ? 'chip active' : 'chip'}
            onClick={() => setFiltroDisp(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Vehículo</th>
                <th>Aprobación</th>
                <th>Disponibilidad</th>
                <th>GPS</th>
                <th>Docs</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={7}>Sin conductores con esos filtros</td>
                </tr>
              ) : (
                visibles.map((c) => (
                  <tr
                    key={c.id}
                    className={
                      detalle?.id === c.id ? 'row-selected' : undefined
                    }
                    onClick={() => setDetalle(c)}
                  >
                    <td>
                      <strong>{c.nombreCompleto}</strong>
                      <div className="muted">{c.telefono}</div>
                    </td>
                    <td>
                      {[c.vehiculoColor, c.vehiculoMarca, c.vehiculoModelo]
                        .filter(Boolean)
                        .join(' ') || '—'}
                      <div className="muted">{c.vehiculoPlaca ?? ''}</div>
                    </td>
                    <td>{badgeAprobacion(c.estadoAprobacion)}</td>
                    <td>{badgeDisponibilidad(c.estadoDisponibilidad)}</td>
                    <td>
                      {tieneGps(c) ? (
                        <span className="badge badge-ok">En mapa</span>
                      ) : (
                        <span className="muted">Sin señal</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="chip"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetalle(c);
                        }}
                      >
                        Ver
                      </button>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {renderAcciones(c)}
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
            <h2>{detalle.nombreCompleto}</h2>
            <button
              type="button"
              className="chip"
              onClick={() => setDetalle(null)}
            >
              Cerrar
            </button>
          </header>
          <dl className="detail-grid">
            <dt>Email</dt>
            <dd>{detalle.email}</dd>
            <dt>Teléfono</dt>
            <dd>
              <a href={`tel:${detalle.telefono}`}>{detalle.telefono}</a>
            </dd>
            <dt>Estado</dt>
            <dd>
              {badgeAprobacion(detalle.estadoAprobacion)}{' '}
              {badgeDisponibilidad(detalle.estadoDisponibilidad)}
            </dd>
            <dt>Vehículo</dt>
            <dd>
              {[detalle.vehiculoColor, detalle.vehiculoMarca, detalle.vehiculoModelo]
                .filter(Boolean)
                .join(' ') || '—'}{' '}
              · {detalle.vehiculoPlaca ?? '—'}
            </dd>
            <dt>GPS</dt>
            <dd>
              {tieneGps(detalle)
                ? `${detalle.ultimaUbicacionLat!.toFixed(5)}, ${detalle.ultimaUbicacionLng!.toFixed(5)}`
                : 'Sin ubicación reciente'}
            </dd>
          </dl>
          <ul className="doc-links">
            <li>Foto: {linkDoc(detalle.fotoUrl, 'abrir')}</li>
            <li>Licencia: {linkDoc(detalle.licenciaUrl, 'abrir')}</li>
            <li>Seguro: {linkDoc(detalle.seguroUrl, 'abrir')}</li>
          </ul>

          {puedeEditar ? (
            <form className="docs-upload-form" onSubmit={onSubirDocs}>
              <h3>Subir / actualizar documentos</h3>
              <div className="alta-conductor-grid">
                <label className="zona-field">
                  <span>Foto perfil</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) =>
                      setFotoFile(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
                <label className="zona-field">
                  <span>Licencia</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) =>
                      setLicenciaFile(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
                <label className="zona-field">
                  <span>Seguro</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) =>
                      setSeguroFile(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={procesando === `docs-${detalle.id}`}
              >
                {procesando === `docs-${detalle.id}`
                  ? 'Subiendo…'
                  : 'Guardar documentos'}
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
