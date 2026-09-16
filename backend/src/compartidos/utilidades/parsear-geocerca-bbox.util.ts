import type { GeocercaBbox } from '../tipos/geocerca-bbox.js';

function esNumeroFinito(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor);
}

/** Parsea el JSON de configuración GEOCERCA_* a un bbox válido, o null. */
export function parsearGeocercaBbox(valor: string): GeocercaBbox | null {
  let raw: unknown;
  try {
    raw = JSON.parse(valor) as unknown;
  } catch {
    return null;
  }

  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const obj = raw as {
    tipo?: unknown;
    latMin?: unknown;
    latMax?: unknown;
    lngMin?: unknown;
    lngMax?: unknown;
  };

  if (obj.tipo !== 'bbox') {
    return null;
  }
  if (
    !esNumeroFinito(obj.latMin) ||
    !esNumeroFinito(obj.latMax) ||
    !esNumeroFinito(obj.lngMin) ||
    !esNumeroFinito(obj.lngMax)
  ) {
    return null;
  }
  if (obj.latMin > obj.latMax || obj.lngMin > obj.lngMax) {
    return null;
  }

  return {
    tipo: 'bbox',
    latMin: obj.latMin,
    latMax: obj.latMax,
    lngMin: obj.lngMin,
    lngMax: obj.lngMax,
  };
}
