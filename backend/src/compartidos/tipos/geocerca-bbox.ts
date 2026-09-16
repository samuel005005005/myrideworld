/** Bounding box geográfico (WGS84) para zonas tarifarias. */
export interface GeocercaBbox {
  readonly tipo: 'bbox';
  readonly latMin: number;
  readonly latMax: number;
  readonly lngMin: number;
  readonly lngMax: number;
}
