import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EstimarTarifaUseCase } from '../../../../../../src/features/tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { EstimarTarifaDto } from '../../../../../../src/features/tarifas/aplicacion/dto/estimar-tarifa.dto.js';
import { Tarifa } from '../../../../../../src/features/tarifas/dominio/entidades/tarifa.entity.js';
import { Configuracion } from '../../../../../../src/features/configuracion/dominio/entidades/configuracion.entity.js';
import { DomainException } from '../../../../../../src/compartidos/excepciones/domain.exception.js';
import { EstadosTarifa } from '../../../../../../src/compartidos/constantes/estados-tarifa.enum.js';

const GEOCERCA_SEED = JSON.stringify({
  tipo: 'bbox',
  latMin: 18.45,
  latMax: 18.53,
  lngMin: -68.48,
  lngMax: -68.35,
});

describe('EstimarTarifaUseCase', () => {
  let useCase: EstimarTarifaUseCase;
  let tarifaRepositoryMock: {
    guardar: ReturnType<typeof vi.fn>;
    obtenerTarifaActiva: ReturnType<typeof vi.fn>;
  };
  let configRepoMock: {
    obtenerPorClave: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    tarifaRepositoryMock = {
      guardar: vi.fn((tarifa: Tarifa) => Promise.resolve(tarifa)),
      obtenerTarifaActiva: vi.fn().mockResolvedValue(null),
    };

    configRepoMock = {
      obtenerPorClave: vi.fn((clave: string) => {
        const valores: { [clave: string]: string } = {
          TARIFA_BASE: '30.0',
          TARIFA_KM: '15.0',
          TARIFA_MINIMA: '50.0',
          TARIFA_ZONA_CAP_CANA: '4',
          GEOCERCA_CAP_CANA: GEOCERCA_SEED,
        };
        const valor = valores[clave];
        if (!valor) {
          return Promise.resolve(null);
        }
        return Promise.resolve(
          Configuracion.crear({ clave, valor, descripcion: clave }),
        );
      }),
    };

    useCase = new EstimarTarifaUseCase(tarifaRepositoryMock, configRepoMock);
  });

  it('DebeEstimarTarifaSinPersistir_CuandoCoordenadasSonValidas', async () => {
    const dto: EstimarTarifaDto = {
      origenLat: 0,
      origenLng: 0,
      destinoLat: 1,
      destinoLng: 0,
    };

    const resultado = await useCase.ejecutar(dto);

    expect(resultado).toBeDefined();
    expect(resultado.precio).toBe(1697.92);
    expect(resultado.distanciaKm).toBeGreaterThan(100);
    expect(resultado.tipoViaje).toBe('EXTERNO');
    expect(tarifaRepositoryMock.guardar).not.toHaveBeenCalled();
  });

  it('DebeAsignarTarifaMinima_CuandoDistanciaEsCorta', async () => {
    const dto: EstimarTarifaDto = {
      origenLat: 0,
      origenLng: 0,
      destinoLat: 0.001,
      destinoLng: 0,
    };

    const resultado = await useCase.ejecutar(dto);

    expect(resultado.precio).toBe(50.0);
    expect(resultado.tipoViaje).toBe('EXTERNO');
  });

  it('DebeFallar_CuandoAdminNoDefinioTarifaBase', async () => {
    configRepoMock.obtenerPorClave = vi.fn((clave: string) => {
      if (clave === 'GEOCERCA_CAP_CANA') {
        return Promise.resolve(
          Configuracion.crear({
            clave,
            valor: GEOCERCA_SEED,
            descripcion: clave,
          }),
        );
      }
      return Promise.resolve(null);
    });

    const dto: EstimarTarifaDto = {
      origenLat: 0,
      origenLng: 0,
      destinoLat: 1,
      destinoLng: 0,
    };

    await expect(useCase.ejecutar(dto)).rejects.toBeInstanceOf(DomainException);
  });

  it('DebeAplicarTarifaPlanaCapCana_CuandoOrigenYDestinoEstanDentro', async () => {
    const dto: EstimarTarifaDto = {
      origenLat: 18.49,
      origenLng: -68.4,
      destinoLat: 18.5,
      destinoLng: -68.42,
    };

    const resultado = await useCase.ejecutar(dto);

    expect(resultado.precio).toBe(4);
    expect(resultado.tipoViaje).toBe('INTERNO_CAP_CANA');
    expect(tarifaRepositoryMock.obtenerTarifaActiva).not.toHaveBeenCalled();
  });

  it('DebeUsarTarifarioOd_CuandoViajeEsMixtoCapCana', async () => {
    const od = Tarifa.crear({
      id: 'od-1',
      origen: 'Cap Cana',
      destino: 'Aeropuerto',
      precio: 45,
      estado: EstadosTarifa.ACTIVO,
    });
    tarifaRepositoryMock.obtenerTarifaActiva.mockResolvedValue(od);

    const dto: EstimarTarifaDto = {
      origenLat: 18.49,
      origenLng: -68.4,
      destinoLat: 18.57,
      destinoLng: -68.36,
      origenNombre: 'Cap Cana',
      destinoNombre: 'Aeropuerto',
    };

    const resultado = await useCase.ejecutar(dto);

    expect(resultado.precio).toBe(45);
    expect(resultado.tarifaId).toBe('od-1');
    expect(resultado.tipoViaje).toBe('EXTERNO');
  });

  it('DebeFallar_CuandoGeocercaCapCanaEsInvalida', async () => {
    configRepoMock.obtenerPorClave = vi.fn((clave: string) => {
      if (clave === 'GEOCERCA_CAP_CANA') {
        return Promise.resolve(
          Configuracion.crear({
            clave,
            valor: '{invalido',
            descripcion: clave,
          }),
        );
      }
      return Promise.resolve(
        Configuracion.crear({ clave, valor: '4', descripcion: clave }),
      );
    });

    const dto: EstimarTarifaDto = {
      origenLat: 18.49,
      origenLng: -68.4,
      destinoLat: 18.5,
      destinoLng: -68.42,
    };

    await expect(useCase.ejecutar(dto)).rejects.toBeInstanceOf(DomainException);
  });
});
