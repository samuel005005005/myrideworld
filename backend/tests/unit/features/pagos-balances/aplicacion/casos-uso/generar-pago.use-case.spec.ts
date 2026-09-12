import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerarPagoUseCase } from '../../../../../../src/features/pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
import { GenerarPagoDto } from '../../../../../../src/features/pagos-balances/aplicacion/dto/generar-pago.dto.js';
import { PagoBalance } from '../../../../../../src/features/pagos-balances/dominio/entidades/pago-balance.entity.js';

describe('GenerarPagoUseCase', () => {
  let useCase: GenerarPagoUseCase;
  let pagoBalanceRepositoryMock: any;
  let configRepoMock: any;

  beforeEach(() => {
    pagoBalanceRepositoryMock = {
      guardar: vi.fn((pago: PagoBalance) => Promise.resolve(pago)),
    };

    configRepoMock = {
      obtenerValor: vi.fn((key: string, defaultValue: string) => {
        if (key === 'FEE_PLATAFORMA') return Promise.resolve('0.20');
        return Promise.resolve(defaultValue);
      }),
    };

    useCase = new GenerarPagoUseCase(pagoBalanceRepositoryMock, configRepoMock);
  });

  it('DebeGenerarPagoConCorteCorrecto_CuandoViajeFinaliza', async () => {
    // Arrange
    const dto: GenerarPagoDto = {
      viajeId: '123e4567-e89b-12d3-a456-426614174000',
      conductorId: '123e4567-e89b-12d3-a456-426614174001',
      montoTotal: 100.0,
    };

    // Act
    const resultado = await useCase.ejecutar(dto);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.montoBruto).toBe(100.0);
    expect(resultado.feeProcesamiento).toBe(20.0); // 20% of 100
    expect(resultado.montoNeto).toBe(80.0); // 100 - 20
    expect(resultado.metodo).toBe('Efectivo');
    expect(pagoBalanceRepositoryMock.guardar).toHaveBeenCalledTimes(1);
    expect(pagoBalanceRepositoryMock.guardar).toHaveBeenCalledWith(resultado);
  });
});
