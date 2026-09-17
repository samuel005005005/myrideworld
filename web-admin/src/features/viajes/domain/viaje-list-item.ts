export interface ViajeParticipanteResumen {
  id: string;
  nombreCompleto: string;
  telefono?: string;
}

export interface ViajeListItem {
  id: string;
  pasajeroId: string;
  conductorId: string | null;
  estado: string;
  tarifaEstimada: number;
  origenLat: number;
  origenLng: number;
  destinoLat: number;
  destinoLng: number;
  origenDireccion?: string | null;
  destinoDireccion?: string | null;
  fechaSolicitud: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  pasajeroNombre?: string | null;
  conductorNombre?: string | null;
  pasajero?: ViajeParticipanteResumen | null;
  conductor?: ViajeParticipanteResumen | null;
}
