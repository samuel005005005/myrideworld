import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../../core/http/api-error';
import type { DashboardStats } from '../../domain/dashboard-stats';
import { obtenerDashboard } from '../../infrastructure/dashboard-api';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setStats(await obtenerDashboard());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo cargar el dashboard',
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Resumen operativo en tiempo real</p>
        </div>
        <button type="button" className="chip" onClick={() => void cargar()}>
          Actualizar
        </button>
      </header>
      {error ? <p className="error-text">{error}</p> : null}
      {cargando ? (
        <p>Cargando…</p>
      ) : stats ? (
        <div className="stats-grid">
          <article className="stat-card">
            <span className="stat-label">Conductores conectados</span>
            <strong className="stat-value">{stats.conductoresConectados}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Conductores ocupados</span>
            <strong className="stat-value">{stats.conductoresOcupados}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Viajes activos</span>
            <strong className="stat-value">{stats.viajesActivos}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Completados hoy</span>
            <strong className="stat-value">{stats.viajesCompletadosHoy}</strong>
          </article>
        </div>
      ) : null}
    </section>
  );
}
