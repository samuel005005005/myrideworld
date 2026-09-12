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
  fechaSolicitud: string;
  fechaInicio: string | null;
  fechaFin: string | null;
}
