import type { GeocercaBbox } from '../tipos/geocerca-bbox.js';

/** True si el punto WGS84 está dentro del bbox (inclusive). */
export function puntoEnGeocercaBbox(
  lat: number,
  lng: number,
  geocerca: GeocercaBbox,
): boolean {
  return (
    lat >= geocerca.latMin &&
    lat <= geocerca.latMax &&
    lng >= geocerca.lngMin &&
    lng <= geocerca.lngMax
  );
}
