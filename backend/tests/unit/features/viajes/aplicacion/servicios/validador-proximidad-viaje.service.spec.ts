import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { ValidadorProximidadViajeService } from '../../../../../../src/features/viajes/aplicacion/servicios/validador-proximidad-viaje.service.js';
import type { IConductorRepository } from '../../../../../../src/features/conductores/dominio/repositorios/conductor.repository.js';
import type { IConfiguracionRepository } from '../../../../../../src/features/configuracion/dominio/repositorios/configuracion.repository.js';
import { Conductor } from '../../../../../../src/features/conductores/dominio/entidades/conductor.entity.js';
import { Configuracion } from '../../../../../../src/features/configuracion/dominio/entidades/configuracion.entity.js';
import { EstadosConductor } from '../../../../../../src/compartidos/constantes/estados-conductor.enum.js';
import { MENSAJES } from '../../../../../../src/compartidos/constantes/mensajes.const.js';

describe('ValidadorProximidadViajeService', () => {
  let servicio: ValidadorProximidadViajeService;
  let conductorRepo: { obtenerPorId: Mock };
  let configRepo: { obtenerPorClave: Mock };

  beforeEach(() => {
    conductorRepo = { obtenerPorId: vi.fn() };
    configRepo = { obtenerPorClave: vi.fn() };
    servicio = new ValidadorProximidadViajeService(
      conductorRepo as unknown as IConductorRepository,
      configRepo as unknown as IConfiguracionRepository,
    );
  });

  it('debería aceptar cuando el conductor está dentro del radio', async () => {
    const conductor = Conductor.crear({
      nombreCompleto: 'Test',
      email: 't@t.com',
      telefono: '123',
      passwordHash: 'x',
      vehiculoMarca: 'Toyota',
      vehiculoModelo: 'Corolla',
      vehiculoColor: 'Blanco',
      vehiculoPlaca: 'A1',
      estadoAprobacion: EstadosConductor.APROBADO,
      ultimaUbicacionLat: 18.582,
      ultimaUbicacionLng: -68.397,
    });
    conductorRepo.obtenerPorId.mockResolvedValue(conductor);
    configRepo.obtenerPorClave.mockResolvedValue(
      Configuracion.crear({
        clave: 'RADIO_PROXIMIDAD_ORIGEN_M',
        valor: '200',
        descripcion: 'radio',
      }),
    );

    await expect(
      servicio.asegurarCercaDe(
        conductor.id,
        18.5821,
        -68.3971,
        MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_RADIO_PROXIMIDAD_ORIGEN_M,
      ),
    ).resolves.toBeUndefined();
  });

  it('debería rechazar sin GPS del conductor', async () => {
    const conductor = Conductor.crear({
      nombreCompleto: 'Test',
      email: 't@t.com',
      telefono: '123',
      passwordHash: 'x',
      vehiculoMarca: 'Toyota',
      vehiculoModelo: 'Corolla',
      vehiculoColor: 'Blanco',
      vehiculoPlaca: 'A1',
      estadoAprobacion: EstadosConductor.APROBADO,
    });
    conductorRepo.obtenerPorId.mockResolvedValue(conductor);

    await expect(
      servicio.asegurarCercaDe(
        conductor.id,
        18.58,
        -68.39,
        MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_RADIO_PROXIMIDAD_ORIGEN_M,
      ),
    ).rejects.toThrow(MENSAJES.EXCEPCIONES.VIAJES.GPS_CONDUCTOR_REQUERIDO);
  });
});
