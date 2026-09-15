export interface ViajeDisponibleNotificacion {
  id: string;
  origenLat: number;
  origenLng: number;
  destinoLat: number;
  destinoLng: number;
  tarifaEstimada: number;
  origenDireccion?: string | null;
  destinoDireccion?: string | null;
}
