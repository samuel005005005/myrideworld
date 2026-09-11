import { GenerarPagoUseCase } from './generar-pago.use-case.js';
import { IPagoBalanceRepository } from '../../dominio/repositorios/pago-balance.repository.js';
import { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('GenerarPagoUseCase', () => {
  let useCase: GenerarPagoUseCase;
  let pagoBalanceRepositoryMock: Mocked<IPagoBalanceRepository>;
  let configRepoMock: Mocked<IConfiguracionRepository>;

  beforeEach(() => {
    pagoBalanceRepositoryMock = {
      guardar: vi.fn(),
      obtenerPorViajeId: vi.fn(),
    } as any;

    configRepoMock = {
      obtenerValor: vi.fn(),
    } as any;

    useCase = new GenerarPagoUseCase(
      pagoBalanceRepositoryMock,
      configRepoMock,
    );
  });

  it('DebeGenerarPagoConFeePorDefecto_CuandoNoHayConfiguracion', async () => {
    // Arrange
    configRepoMock.obtenerValor.mockResolvedValue('0.20'); // Valor por defecto
    pagoBalanceRepositoryMock.guardar.mockImplementation(async (p) => p);

    // Act
    const result = await useCase.ejecutar({
      viajeId: 'viaje-1',
      conductorId: 'conductor-1',
      montoTotal: 100,
    });

    // Assert
    expect(result.montoBruto).toBe(100);
    expect(result.feeProcesamiento).toBe(20);
    expect(result.montoNeto).toBe(80);
    expect(pagoBalanceRepositoryMock.guardar).toHaveBeenCalled();
  });

  it('DebeGenerarPagoConFeeConfigurado_CuandoHayConfiguracion', async () => {
    // Arrange
    configRepoMock.obtenerValor.mockResolvedValue('0.15'); // 15% fee
    pagoBalanceRepositoryMock.guardar.mockImplementation(async (p) => p);

    // Act
    const result = await useCase.ejecutar({
      viajeId: 'viaje-2',
      conductorId: 'conductor-2',
      montoTotal: 200,
    });

    // Assert
    expect(result.montoBruto).toBe(200);
    expect(result.feeProcesamiento).toBe(30);
    expect(result.montoNeto).toBe(170);
    expect(pagoBalanceRepositoryMock.guardar).toHaveBeenCalled();
  });
});
