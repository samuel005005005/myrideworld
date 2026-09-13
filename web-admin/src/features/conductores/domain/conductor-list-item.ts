export interface ConductorListItem {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  estadoAprobacion: string;
  estadoDisponibilidad: string;
  fotoUrl?: string | null;
  licenciaUrl?: string | null;
  seguroUrl?: string | null;
  vehiculoPlaca?: string;
  vehiculoMarca?: string;
  vehiculoModelo?: string;
  vehiculoColor?: string;
  ultimaUbicacionLat?: number | null;
  ultimaUbicacionLng?: number | null;
}
