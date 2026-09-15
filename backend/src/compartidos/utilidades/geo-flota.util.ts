/** Tamaño de celda ~5.5 km (0.05°). */
const TAMANO_CELDA_GRADOS = 0.05;

/** Radio en celdas: 5x5 ≈ cobertura ~27 km para mapa tipo Uber. */
const RADIO_CELDAS = 2;

export function claveSalaFlota(lat: number, lng: number): string {
  const celdaLat = Math.floor(lat / TAMANO_CELDA_GRADOS);
  const celdaLng = Math.floor(lng / TAMANO_CELDA_GRADOS);
  return `flota_${celdaLat}_${celdaLng}`;
}

/** Celdas alrededor del punto (pasajero escucha / conductor publica vecinos). */
export function clavesSalasFlotaAlrededor(lat: number, lng: number): string[] {
  const baseLat = Math.floor(lat / TAMANO_CELDA_GRADOS);
  const baseLng = Math.floor(lng / TAMANO_CELDA_GRADOS);
  const claves: string[] = [];
  for (let dLat = -RADIO_CELDAS; dLat <= RADIO_CELDAS; dLat++) {
    for (let dLng = -RADIO_CELDAS; dLng <= RADIO_CELDAS; dLng++) {
      claves.push(`flota_${baseLat + dLat}_${baseLng + dLng}`);
    }
  }
  return claves;
}
