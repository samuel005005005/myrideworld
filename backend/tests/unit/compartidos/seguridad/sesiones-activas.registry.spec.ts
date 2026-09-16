import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SesionesActivasRegistry } from '../../../../src/compartidos/seguridad/sesiones-activas.registry.js';

describe('SesionesActivasRegistry', () => {
  let registry: SesionesActivasRegistry;

  beforeEach(() => {
    registry = new SesionesActivasRegistry();
  });

  it('solo una sid vigente por usuario', () => {
    registry.activar('u1', 'sid-a');
    expect(registry.esVigente('u1', 'sid-a')).toBe(true);
    expect(registry.esVigente('u1', 'sid-b')).toBe(false);

    registry.activar('u1', 'sid-b');
    expect(registry.esVigente('u1', 'sid-a')).toBe(false);
    expect(registry.esVigente('u1', 'sid-b')).toBe(true);
  });

  it('rehidrata sid tras reinicio (mapa vacío)', () => {
    expect(registry.esVigente('u1', 'sid-old')).toBe(true);
    expect(registry.esVigente('u1', 'sid-other')).toBe(false);
  });

  it('expulsa al activar nueva sesión', () => {
    const expulsor = vi.fn();
    registry.registrarExpulsor(expulsor);
    registry.activar('u1', 'sid-1');
    expect(expulsor).toHaveBeenCalledWith('u1', 'sid-1');
  });

  it('rechaza sid ausente', () => {
    expect(registry.esVigente('u1', undefined)).toBe(false);
  });
});
