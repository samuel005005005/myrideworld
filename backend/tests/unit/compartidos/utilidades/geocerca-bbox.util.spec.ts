import { describe, it, expect } from 'vitest';
import { parsearGeocercaBbox } from '../../../../src/compartidos/utilidades/parsear-geocerca-bbox.util.js';
import { puntoEnGeocercaBbox } from '../../../../src/compartidos/utilidades/punto-en-geocerca-bbox.util.js';

describe('parsearGeocercaBbox', () => {
  it('DebeParsearBboxValido', () => {
    const geocerca = parsearGeocercaBbox(
      JSON.stringify({
        tipo: 'bbox',
        latMin: 18.45,
        latMax: 18.53,
        lngMin: -68.48,
        lngMax: -68.35,
      }),
    );

    expect(geocerca).toEqual({
      tipo: 'bbox',
      latMin: 18.45,
      latMax: 18.53,
      lngMin: -68.48,
      lngMax: -68.35,
    });
  });

  it('DebeRetornarNull_CuandoJsonEsInvalido', () => {
    expect(parsearGeocercaBbox('{')).toBeNull();
    expect(parsearGeocercaBbox('{"tipo":"poligono"}')).toBeNull();
  });
});

describe('puntoEnGeocercaBbox', () => {
  const geocerca = {
    tipo: 'bbox' as const,
    latMin: 18.45,
    latMax: 18.53,
    lngMin: -68.48,
    lngMax: -68.35,
  };

  it('DebeDetectarPuntoDentroDeCapCana', () => {
    expect(puntoEnGeocercaBbox(18.49, -68.4, geocerca)).toBe(true);
  });

  it('DebeDetectarPuntoFueraDeCapCana', () => {
    expect(puntoEnGeocercaBbox(18.57, -68.36, geocerca)).toBe(false);
  });
});
