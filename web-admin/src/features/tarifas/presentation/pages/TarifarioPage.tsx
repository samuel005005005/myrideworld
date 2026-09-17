import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useAuth } from '../../../../core/auth/auth-provider';
import { ApiError } from '../../../../core/http/api-error';
import {
  actualizarConfiguracion,
  listarConfiguraciones,
} from '../../../configuracion/infrastructure/configuracion-api';
import type { TarifaItem } from '../../domain/tarifa-item';
import type { ZonaTarifaItem } from '../../domain/zona-tarifa-item';
import {
  actualizarTarifa,
  crearTarifa,
  crearZonaTarifa,
  listarTarifas,
  listarZonasTarifa,
} from '../../infrastructure/tarifas-api';

const CLAVE_TARIFA_CAP_CANA = 'TARIFA_ZONA_CAP_CANA';

function SelectorZona({
  label,
  value,
  onChange,
  opciones,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opciones: readonly string[];
}) {
  return (
    <label className="zona-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="">Elegir…</option>
        {opciones.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TarifarioPage() {
  const { puedeEscribir } = useAuth();
  const puedeEditar = puedeEscribir('tarifario');
  const puedeEditarConfig = puedeEscribir('configuracion');

  const [items, setItems] = useState<TarifaItem[]>([]);
  const [zonas, setZonas] = useState<ZonaTarifaItem[]>([]);
  const [origenSel, setOrigenSel] = useState('');
  const [destinoSel, setDestinoSel] = useState('');
  const [precio, setPrecio] = useState('');
  const [nuevaZona, setNuevaZona] = useState('');
  const [precioCapCana, setPrecioCapCana] = useState('');
  const [precioCapCanaGuardado, setPrecioCapCanaGuardado] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activo' | 'Inactivo'>(
    'Activo',
  );
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [tarifas, catalogo, configs] = await Promise.all([
        listarTarifas(),
        listarZonasTarifa(),
        listarConfiguraciones().catch(() => []),
      ]);
      setItems(tarifas);
      setZonas(catalogo);
      const cap = configs.find((c) => c.clave === CLAVE_TARIFA_CAP_CANA);
      const valor = cap?.valor ?? '';
      setPrecioCapCana(valor);
      setPrecioCapCanaGuardado(valor);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo cargar el tarifario',
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const opciones = useMemo(
    () =>
      zonas
        .filter((z) => z.activa)
        .map((z) => z.nombre)
        .sort((a, b) => a.localeCompare(b, 'es')),
    [zonas],
  );

  const zonasCapCana = useMemo(
    () =>
      opciones.filter((n) => n.toLowerCase().includes('cap cana')),
    [opciones],
  );

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return items.filter((t) => {
      if (filtroEstado !== 'Todos' && t.estado !== filtroEstado) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        t.origen.toLowerCase().includes(q) ||
        t.destino.toLowerCase().includes(q)
      );
    });
  }, [items, filtroEstado, busqueda]);

  function intercambiar() {
    setOrigenSel(destinoSel);
    setDestinoSel(origenSel);
  }

  async function guardarCapCana(event: FormEvent) {
    event.preventDefault();
    if (!puedeEditarConfig) {
      return;
    }
    const valor = precioCapCana.trim();
    const num = Number(valor);
    if (!Number.isFinite(num) || num <= 0) {
      setError('Indicá un precio Cap Cana válido en USD');
      return;
    }
    setProcesando('capcana');
    setError(null);
    setOkMsg(null);
    try {
      await actualizarConfiguracion(CLAVE_TARIFA_CAP_CANA, String(num));
      setPrecioCapCanaGuardado(String(num));
      setOkMsg(`Precio interno Cap Cana actualizado a US$${num.toFixed(2)}`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el precio Cap Cana',
      );
    } finally {
      setProcesando(null);
    }
  }

  async function onCrearZona(event: FormEvent) {
    event.preventDefault();
    if (!puedeEditar) {
      return;
    }
    const nombre = nuevaZona.trim();
    if (!nombre) {
      setError('Indicá el nombre del lugar / zona');
      return;
    }
    setProcesando('zona');
    setError(null);
    setOkMsg(null);
    try {
      const zona = await crearZonaTarifa(nombre);
      setNuevaZona('');
      setOkMsg(`Lugar «${zona.nombre}» agregado`);
      await cargar();
      setOrigenSel(zona.nombre);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo crear el lugar',
      );
    } finally {
      setProcesando(null);
    }
  }

  async function onCrear(event: FormEvent) {
    event.preventDefault();
    if (!puedeEditar) {
      return;
    }
    const origen = origenSel.trim();
    const destino = destinoSel.trim();
    const precioNum = Number(precio);
    if (!origen || !destino || !Number.isFinite(precioNum) || precioNum <= 0) {
      setError('Elegí origen, destino y un precio válido en USD');
      return;
    }
    if (origen === destino) {
      setError('Origen y destino deben ser distintos');
      return;
    }
    setProcesando('crear');
    setError(null);
    setOkMsg(null);
    try {
      await crearTarifa({ origen, destino, precio: precioNum });
      setPrecio('');
      setOkMsg(`Ruta ${origen} → ${destino} creada`);
      await cargar();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo crear la tarifa',
      );
    } finally {
      setProcesando(null);
    }
  }

  async function toggleEstado(item: TarifaItem) {
    if (!puedeEditar) {
      return;
    }
    setProcesando(item.id);
    setError(null);
    try {
      await actualizarTarifa(item.id, {
        estado: item.estado === 'Activo' ? 'Inactivo' : 'Activo',
      });
      await cargar();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo actualizar la tarifa',
      );
    } finally {
      setProcesando(null);
    }
  }

  async function guardarPrecio(item: TarifaItem, nuevo: string) {
    if (!puedeEditar) {
      return;
    }
    const precioNum = Number(nuevo);
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      setError('Precio inválido');
      return;
    }
    if (precioNum === item.precio) {
      return;
    }
    setProcesando(item.id);
    setError(null);
    try {
      await actualizarTarifa(item.id, { precio: precioNum });
      await cargar();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo actualizar el precio',
      );
    } finally {
      setProcesando(null);
    }
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Tarifario</h1>
          <p className="muted">
            Interno Cap Cana (precio fijo) y rutas externas por origen → destino
          </p>
        </div>
        <button type="button" className="chip" onClick={() => void cargar()}>
          Actualizar
        </button>
      </header>

      {error ? <p className="error-text">{error}</p> : null}
      {okMsg ? <p className="ok-text">{okMsg}</p> : null}

      <div className="tarifario-capcana-card">
        <div>
          <h2>Interno Cap Cana</h2>
          <p className="muted">
            Si el viaje sale de un punto dentro de Cap Cana y llega a otro punto
            dentro de Cap Cana, cobra este precio fijo (no el tarifario OD).
          </p>
          {zonasCapCana.length > 0 ? (
            <p className="muted cell-sub">
              Lugares Cap Cana en catálogo: {zonasCapCana.join(' · ')}
            </p>
          ) : null}
        </div>
        <form className="tarifario-capcana-form" onSubmit={guardarCapCana}>
          <label className="zona-field">
            <span>Precio USD</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={precioCapCana}
              onChange={(e) => setPrecioCapCana(e.target.value)}
              readOnly={!puedeEditarConfig}
              required
            />
          </label>
          {puedeEditarConfig ? (
            <button
              type="submit"
              className="btn-primary"
              disabled={
                procesando === 'capcana' ||
                precioCapCana.trim() === precioCapCanaGuardado
              }
            >
              {procesando === 'capcana' ? '…' : 'Guardar'}
            </button>
          ) : null}
        </form>
      </div>

      {puedeEditar ? (
        <>
          <h2 className="tarifario-section-title">Rutas externas (OD)</h2>
          <form className="tarifario-form" onSubmit={onCrear}>
            <div className="tarifario-od-row">
              <SelectorZona
                label="Desde"
                value={origenSel}
                onChange={setOrigenSel}
                opciones={opciones}
              />
              <button
                type="button"
                className="chip swap-btn"
                onClick={intercambiar}
                title="Intercambiar"
              >
                ⇄
              </button>
              <SelectorZona
                label="Hasta"
                value={destinoSel}
                onChange={setDestinoSel}
                opciones={opciones}
              />
              <label className="zona-field">
                <span>Precio USD</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="btn-primary"
                disabled={procesando === 'crear' || opciones.length === 0}
              >
                {procesando === 'crear' ? '…' : 'Agregar ruta'}
              </button>
            </div>
          </form>

          <form className="tarifario-form" onSubmit={onCrearZona}>
            <div className="zona-nueva-row">
              <label className="zona-field" style={{ flex: 1 }}>
                <span>Agregar lugar al catálogo</span>
                <input
                  placeholder="Ej. Juanillo Beach Cap Cana"
                  value={nuevaZona}
                  onChange={(e) => setNuevaZona(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="btn-secondary"
                disabled={procesando === 'zona'}
              >
                {procesando === 'zona' ? '…' : 'Agregar lugar'}
              </button>
            </div>
          </form>
        </>
      ) : null}

      <div className="filters filters-form">
        <label>
          Estado
          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(e.target.value as 'Todos' | 'Activo' | 'Inactivo')
            }
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </label>
        <label>
          Buscar
          <input
            placeholder="Filtrar por lugar…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </div>

      {cargando ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Desde → Hasta</th>
                <th>Precio USD</th>
                <th>Estado</th>
                {puedeEditar ? <th /> : null}
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={puedeEditar ? 4 : 3}>Sin rutas OD</td>
                </tr>
              ) : (
                visibles.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="ruta-texto">
                        <div>{t.origen}</div>
                        <div className="muted">→ {t.destino}</div>
                      </div>
                    </td>
                    <td>
                      {puedeEditar ? (
                        <input
                          className="precio-inline"
                          type="number"
                          min="0.01"
                          step="0.01"
                          defaultValue={t.precio}
                          key={`${t.id}-${t.precio}`}
                          disabled={procesando === t.id}
                          onBlur={(e) => void guardarPrecio(t, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                        />
                      ) : (
                        `US$${Number(t.precio).toFixed(2)}`
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          t.estado === 'Activo' ? 'badge badge-ok' : 'badge'
                        }
                      >
                        {t.estado}
                      </span>
                    </td>
                    {puedeEditar ? (
                      <td>
                        <button
                          type="button"
                          className="btn-secondary"
                          disabled={procesando === t.id}
                          onClick={() => void toggleEstado(t)}
                        >
                          {procesando === t.id
                            ? '…'
                            : t.estado === 'Activo'
                              ? 'Desactivar'
                              : 'Activar'}
                        </button>
                      </td>
                    ) : null}
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
