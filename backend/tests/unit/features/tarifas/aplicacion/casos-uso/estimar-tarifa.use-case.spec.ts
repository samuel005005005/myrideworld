import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EstimarTarifaUseCase, EstimarTarifaDto } from '../../../../../../src/features/tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { Tarifa } from '../../../../../../src/features/tarifas/dominio/entidades/tarifa.entity.js';

describe('EstimarTarifaUseCase', () => {
  let useCase: EstimarTarifaUseCase;
  let tarifaRepositoryMock: any;
  let configRepoMock: any;

  beforeEach(() => {
    tarifaRepositoryMock = {
      guardar: vi.fn((tarifa: Tarifa) => Promise.resolve(tarifa)),
    };

    configRepoMock = {
      obtenerValor: vi.fn((key: string, defaultValue: string) => {
        if (key === 'TARIFA_BASE') return Promise.resolve('30.0');
        if (key === 'TARIFA_KM') return Promise.resolve('15.0');
        if (key === 'TARIFA_MINIMA') return Promise.resolve('50.0');
        return Promise.resolve(defaultValue);
      }),
    };

    useCase = new EstimarTarifaUseCase(tarifaRepositoryMock, configRepoMock);
  });

  it('DebeEstimarTarifaYGuardar_CuandoCoordenadasSonValidas', async () => {
    // Arrange
    const dto: EstimarTarifaDto = {
      origenLat: 0,
      origenLng: 0,
      destinoLat: 1, // approx 111km distance
      destinoLng: 0,
    };
    // Expected distance = 111 km
    // Expected price = 30 + (111 * 15) = 30 + 1665 = 1695

    // Act
    const resultado = await useCase.ejecutar(dto);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.precio).toBe(1695);
    expect(tarifaRepositoryMock.guardar).toHaveBeenCalledTimes(1);
    expect(tarifaRepositoryMock.guardar).toHaveBeenCalledWith(resultado);
  });

  it('DebeAsignarTarifaMinima_CuandoDistanciaEsCorta', async () => {
    // Arrange
    const dto: EstimarTarifaDto = {
      origenLat: 0,
      origenLng: 0,
      destinoLat: 0.001, // very short distance
      destinoLng: 0,
    };
    // Expected distance = 0.111 km
    // Price = 30 + (0.111 * 15) = 30 + 1.665 = 31.665 (which is less than 50.0)
    // Should fallback to 50.0

    // Act
    const resultado = await useCase.ejecutar(dto);

    // Assert
    expect(resultado.precio).toBe(50.0);
  });
});
