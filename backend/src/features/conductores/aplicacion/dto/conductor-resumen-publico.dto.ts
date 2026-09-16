export class ConductorResumenPublicoDto {
  id: string;
  nombreCompleto: string;
  telefono: string;
  fotoUrl: string | null;
  vehiculoMarca: string;
  vehiculoModelo: string;
  vehiculoColor: string;
  vehiculoPlaca: string;
  /** Última ubicación conocida (para tracking pasajero). */
  lat: number | null;
  lng: number | null;
}
