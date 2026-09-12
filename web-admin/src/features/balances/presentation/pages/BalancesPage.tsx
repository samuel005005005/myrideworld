import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../core/auth/auth-provider';
import { ApiError } from '../../../../core/http/api-error';
import { exportarCsv } from '../../../../shared/utils/exportar-csv';
import type { LiquidacionResumen } from '../../domain/liquidacion-resumen';
import type { PagoBalanceItem } from '../../domain/pago-balance-item';
import {
  listarBalancesAdmin,
  obtenerLiquidacion,
} from '../../infrastructure/balances-api';

export function BalancesPage() {
  const { puedeEscribir } = useAuth();
  const soloLectura = !puedeEscribir('balances');

  const [items, setItems] = useState<PagoBalanceItem[]>([]);
  const [resumen, setResumen] = useState<LiquidacionResumen | null>(null);
  const [conductorId, setConductorId] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const filtros = {
        conductorId: conductorId || undefined,
        desde: desde || undefined,
        hasta: hasta || undefined,
      };
      const [lista, liquidacion] = await Promise.all([
        listarBalancesAdmin(filtros),
        obtenerLiquidacion({ desde: filtros.desde, hasta: filtros.hasta }),
      ]);
      setItems(lista);
      setResumen(liquidacion);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudieron cargar balances',
      );
    } finally {
      setCargando(false);
    }
  }, [conductorId, desde, hasta]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  function exportar() {
    exportarCsv(
      `balances-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        'ID',
        'Viaje',
        'Conductor',
        'Bruto',
        'Fee',
        'Neto',
        'Método',
        'Fecha',
      ],
      items.map((p) => [
        p.id,
        p.viajeId,
        p.conductorId,
        p.montoBruto.toFixed(2),
        p.feeProcesamiento.toFixed(2),
        p.montoNeto.toFixed(2),
        p.metodo,
        new Date(p.fecha).toISOString(),
      ]),
    );
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Balances</h1>
          <p className="muted">
            Pagos y liquidación{soloLectura ? ' (solo lectura)' : ''}
          </p>
        </div>
        <div className="filters">
          <button type="button" className="chip" onClick={() => void cargar()}>
            Actualizar
          </button>
          <button
            type="button"
            className="chip"
            disabled={items.length === 0}
            onClick={exportar}
          >
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="filters-panel">
        <label>
          Conductor ID
          <input
            value={conductorId}
            onChange={(e) => setConductorId(e.target.value)}
            placeholder="UUID opcional"
          />
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
        <button type="button" className="chip active" onClick={() => void cargar()}>
          Filtrar
        </button>
      </div>

      {resumen ? (
        <div className="stats-grid stats-grid-compact">
          <article className="stat-card">
            <span className="stat-label">Total bruto</span>
            <strong className="stat-value">
              US${resumen.totalBruto.toFixed(2)}
            </strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Total fee</span>
            <strong className="stat-value">
              US${resumen.totalFee.toFixed(2)}
            </strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Total neto</span>
            <strong className="stat-value">
              US${resumen.totalNeto.toFixed(2)}
            </strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Cantidad</span>
            <strong className="stat-value">{resumen.cantidad}</strong>
          </article>
        </div>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}
      {cargando ? (
        <p>Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Conductor</th>
                <th>Viaje</th>
                <th>Bruto</th>
                <th>Fee</th>
                <th>Neto</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7}>Sin registros</td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.fecha).toLocaleString()}</td>
                    <td>
                      <code>{p.conductorId.slice(0, 8)}</code>
                    </td>
                    <td>
                      <code>{p.viajeId.slice(0, 8)}</code>
                    </td>
                    <td>US${p.montoBruto.toFixed(2)}</td>
                    <td>US${p.feeProcesamiento.toFixed(2)}</td>
                    <td>US${p.montoNeto.toFixed(2)}</td>
                    <td>{p.metodo}</td>
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
