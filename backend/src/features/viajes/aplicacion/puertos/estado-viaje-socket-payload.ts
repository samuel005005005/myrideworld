import type { ConductorResumenPublicoDto } from '../../../conductores/aplicacion/dto/conductor-resumen-publico.dto.js';
import type { PasajeroResumenPublicoDto } from '../../../pasajeros/aplicacion/dto/pasajero-resumen-publico.dto.js';

/** Snapshot del viaje al unirse / reconectar al room (fuente: BD). */
export interface EstadoViajeSocketPayload {
  id: string;
  pasajeroId: string;
  conductorId: string | null;
  origenLat: number;
  origenLng: number;
  destinoLat: number;
  destinoLng: number;
  origenDireccion: string | null;
  destinoDireccion: string | null;
  estado: string;
  tarifaEstimada: number;
  fechaSolicitud: Date;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  conductor: ConductorResumenPublicoDto | null;
  pasajero: PasajeroResumenPublicoDto | null;
  ubicacionConductor: { lat: number; lng: number } | null;
}
