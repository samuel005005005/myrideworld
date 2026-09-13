import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../../core/auth/auth-provider';
import { ApiError } from '../../../../core/http/api-error';

export function LoginPage() {
  const { autenticado, iniciarSesion, primeraRuta } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  if (autenticado) {
    return <Navigate to={primeraRuta} replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(email.trim(), password);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No fue posible iniciar sesión',
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-page">
      <aside className="login-hero">
        <div className="login-hero-inner">
          <h1>
            My<span>Ride</span>
          </h1>
          <p>
            Operá flota, tarifario y viajes en Punta Cana desde un solo panel.
          </p>
        </div>
      </aside>
      <div className="login-panel">
        <form className="login-card" onSubmit={onSubmit}>
          <h2>Ingresar</h2>
          <p className="muted">Acceso para personal autorizado de la asociación.</p>
          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="vos@asociacion.com"
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" disabled={cargando}>
            {cargando ? 'Entrando…' : 'Entrar al panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
