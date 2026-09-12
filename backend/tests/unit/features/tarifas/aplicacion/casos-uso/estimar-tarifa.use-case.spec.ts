import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EstimarTarifaUseCase } from '../../../../../../src/features/tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { EstimarTarifaDto } from '../../../../../../src/features/tarifas/aplicacion/dto/estimar-tarifa.dto.js';
import { Tarifa } from '../../../../../../src/features/tarifas/dominio/entidades/tarifa.entity.js';
import { Configuracion } from '../../../../../../src/features/configuracion/dominio/entidades/configuracion.entity.js';
import { DomainException } from '../../../../../../src/compartidos/excepciones/domain.exception.js';

describe('EstimarTarifaUseCase', () => {
  let useCase: EstimarTarifaUseCase;
  let tarifaRepositoryMock: any;
  let configRepoMock: any;

  beforeEach(() => {
    tarifaRepositoryMock = {
      guardar: vi.fn((tarifa: Tarifa) => Promise.resolve(tarifa)),
    };

    configRepoMock = {
      obtenerPorClave: vi.fn((clave: string) => {
        const valores: Record<string, string> = {
          TARIFA_BASE: '30.0',
          TARIFA_KM: '15.0',
          TARIFA_MINIMA: '50.0',
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
  });

  it('DebeFallar_CuandoAdminNoDefinioTarifaBase', async () => {
    configRepoMock.obtenerPorClave = vi.fn().mockResolvedValue(null);

    const dto: EstimarTarifaDto = {
      origenLat: 0,
      origenLng: 0,
      destinoLat: 1,
      destinoLng: 0,
    };

    await expect(useCase.ejecutar(dto)).rejects.toBeInstanceOf(DomainException);
  });
});
