import { useState, type FormEvent } from 'react';
import { ApiError } from '../../../../core/http/api-error';
import type { CrearConductorPayload } from '../../domain/crear-conductor-payload';
import { crearConductor } from '../../infrastructure/conductores-api';

interface AltaConductorFormProps {
  onCreado: () => void | Promise<void>;
}

const VACIO: CrearConductorPayload = {
  nombreCompleto: '',
  email: '',
  telefono: '',
  vehiculoMarca: '',
  vehiculoModelo: '',
  vehiculoColor: '',
  vehiculoPlaca: '',
  password: '',
  aprobarAlCrear: true,
};

export function AltaConductorForm({ onCreado }: AltaConductorFormProps) {
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState<CrearConductorPayload>(VACIO);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  function setCampo<K extends keyof CrearConductorPayload>(
    key: K,
    value: CrearConductorPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setProcesando(true);
    setError(null);
    setOkMsg(null);
    try {
      const creado = await crearConductor({
        ...form,
        nombreCompleto: form.nombreCompleto.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        vehiculoMarca: form.vehiculoMarca.trim(),
        vehiculoModelo: form.vehiculoModelo.trim(),
        vehiculoColor: form.vehiculoColor.trim(),
        vehiculoPlaca: form.vehiculoPlaca.trim().toUpperCase(),
      });
      setForm(VACIO);
      setOkMsg(
        `Conductor ${creado.nombreCompleto} creado (${creado.estadoAprobacion})`,
      );
      await onCreado();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo dar de alta',
      );
    } finally {
      setProcesando(false);
    }
  }

  if (!abierto) {
    return (
      <div className="alta-conductor-form" style={{ padding: '12px 16px' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setAbierto(true);
            setError(null);
            setOkMsg(null);
          }}
        >
          Nuevo conductor
        </button>
      </div>
    );
  }

  return (
    <form className="alta-conductor-form" onSubmit={onSubmit}>
      <header className="page-header" style={{ marginBottom: 12 }}>
        <div>
          <h2>Alta de conductor</h2>
          <p className="muted">
            Solo personal de la asociación. El chofer usa email y contraseña en
            la app.
          </p>
        </div>
        <button
          type="button"
          className="chip"
          onClick={() => setAbierto(false)}
        >
          Cerrar
        </button>
      </header>

      {error ? <p className="error-text">{error}</p> : null}
      {okMsg ? <p className="ok-text">{okMsg}</p> : null}

      <div className="alta-conductor-grid">
        <label className="zona-field">
          <span>Nombre completo</span>
          <input
            value={form.nombreCompleto}
            onChange={(e) => setCampo('nombreCompleto', e.target.value)}
            required
          />
        </label>
        <label className="zona-field">
          <span>Email (login app)</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setCampo('email', e.target.value)}
            required
            autoComplete="off"
          />
        </label>
        <label className="zona-field">
          <span>Teléfono</span>
          <input
            value={form.telefono}
            onChange={(e) => setCampo('telefono', e.target.value)}
            required
            minLength={8}
          />
        </label>
        <label className="zona-field">
          <span>Contraseña inicial</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setCampo('password', e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        <label className="zona-field">
          <span>Marca vehículo</span>
          <input
            value={form.vehiculoMarca}
            onChange={(e) => setCampo('vehiculoMarca', e.target.value)}
            required
          />
        </label>
        <label className="zona-field">
          <span>Modelo</span>
          <input
            value={form.vehiculoModelo}
            onChange={(e) => setCampo('vehiculoModelo', e.target.value)}
            required
          />
        </label>
        <label className="zona-field">
          <span>Color</span>
          <input
            value={form.vehiculoColor}
            onChange={(e) => setCampo('vehiculoColor', e.target.value)}
            required
          />
        </label>
        <label className="zona-field">
          <span>Placa</span>
          <input
            value={form.vehiculoPlaca}
            onChange={(e) => setCampo('vehiculoPlaca', e.target.value)}
            required
          />
        </label>
      </div>

      <label className="chip-toggle" style={{ marginTop: 4 }}>
        <input
          type="checkbox"
          checked={Boolean(form.aprobarAlCrear)}
          onChange={(e) => setCampo('aprobarAlCrear', e.target.checked)}
        />
        Aprobar al crear (queda activo para operar)
      </label>

      <div className="row-actions" style={{ marginTop: 12 }}>
        <button type="submit" className="btn-primary" disabled={procesando}>
          {procesando ? 'Guardando…' : 'Dar de alta'}
        </button>
        <button
          type="button"
          className="chip"
          disabled={procesando}
          onClick={() => {
            setForm(VACIO);
            setError(null);
            setOkMsg(null);
          }}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
