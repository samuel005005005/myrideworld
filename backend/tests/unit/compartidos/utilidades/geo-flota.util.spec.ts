import { describe, expect, it } from 'vitest';
import {
  claveSalaFlota,
  clavesSalasFlotaAlrededor,
} from '../../../../src/compartidos/utilidades/geo-flota.util.js';

describe('geo-flota.util', () => {
  it('DebeGenerarClaveDeSalaEstable_CuandoMismaCelda', () => {
    const a = claveSalaFlota(18.582, -68.402);
    const b = claveSalaFlota(18.583, -68.403);
    expect(a).toBe(b);
  });

  it('DebeIncluirVeinticincoSalas_CuandoPideAlrededor', () => {
    const salas = clavesSalasFlotaAlrededor(18.58, -68.40);
    expect(salas).toHaveLength(25);
    expect(salas).toContain(claveSalaFlota(18.58, -68.40));
  });
});