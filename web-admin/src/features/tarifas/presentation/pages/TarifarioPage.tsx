import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../../../../core/auth/auth-provider';
import { ApiError } from '../../../../core/http/api-error';
import type { TarifaItem } from '../../domain/tarifa-item';
import {
  actualizarTarifa,
  crearTarifa,
  listarTarifas,
} from '../../infrastructure/tarifas-api';

export function TarifarioPage() {
  const { puedeEscribir } = useAuth();
  const puedeEditar = puedeEscribir('tarifario');

  const [items, setItems] = useState<TarifaItem[]>([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [precio, setPrecio] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setItems(await listarTarifas());
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

  async function onCrear(event: FormEvent) {
    event.preventDefault();
    if (!puedeEditar) {
      return;
    }
    const precioNum = Number(precio);
    if (!origen.trim() || !destino.trim() || !Number.isFinite(precioNum)) {
      setError('Complete origen, destino y precio válido');
      return;
    }
    setProcesando('crear');
    setError(null);
    try {
      await crearTarifa({
        origen: origen.trim(),
        destino: destino.trim(),
        precio: precioNum,
      });
      setOrigen('');
      setDestino('');
      setPrecio('');
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

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Tarifario</h1>
          <p className="muted">Tarifas origen–destino (OD)</p>
        </div>
        <button type="button" className="chip" onClick={() => void cargar()}>
          Actualizar
        </button>
      </header>
      {error ? <p className="error-text">{error}</p> : null}
      {puedeEditar ? (
        <form className="inline-form" onSubmit={onCrear}>
          <input
            placeholder="Origen"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            required
          />
          <input
            placeholder="Destino"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            required
          />
          <input
            placeholder="Precio USD"
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
          <button type="submit" disabled={procesando === 'crear'}>
            {procesando === 'crear' ? '…' : 'Agregar'}
          </button>
        </form>
      ) : null}
      {cargando ? (
        <p>Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Precio</th>
                <th>Estado</th>
                {puedeEditar ? <th /> : null}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={puedeEditar ? 5 : 4}>Sin tarifas</td>
                </tr>
              ) : (
                items.map((t) => (
                  <tr key={t.id}>
                    <td>{t.origen}</td>
                    <td>{t.destino}</td>
                    <td>US${t.precio.toFixed(2)}</td>
                    <td>{t.estado}</td>
                    {puedeEditar ? (
                      <td>
                        <button
                          type="button"
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
