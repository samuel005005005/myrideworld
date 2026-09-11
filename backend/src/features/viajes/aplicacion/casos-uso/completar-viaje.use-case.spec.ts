import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CompletarViajeUseCase } from './completar-viaje.use-case.js';
import { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
import { RegistrarBitacoraUseCase } from '../../../bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

describe('CompletarViajeUseCase', () => {
  let useCase: CompletarViajeUseCase;
  let viajeRepositoryMock: Record<keyof IViajeRepository, Mock>;
  let generarPagoUseCaseMock: Partial<Record<keyof GenerarPagoUseCase, Mock>>;
  let registrarBitacoraUseCaseMock: Partial<Record<keyof RegistrarBitacoraUseCase, Mock>>;

  beforeEach(() => {
    // Arrange: Crear mocks
    viajeRepositoryMock = {
      obtenerPorId: vi.fn(),
      listarTodos: vi.fn(),
      guardar: vi.fn(),
      eliminar: vi.fn(),
      obtenerPorConductorYEstado: vi.fn(),
    };

    generarPagoUseCaseMock = {
      ejecutar: vi.fn(),
    };

    registrarBitacoraUseCaseMock = {
      ejecutar: vi.fn(),
    };

    useCase = new CompletarViajeUseCase(
      viajeRepositoryMock as any,
      generarPagoUseCaseMock as any,
      registrarBitacoraUseCaseMock as any,
    );
  });

  it('debería completar un viaje exitosamente', async () => {
    // Arrange
    const viaje = Viaje.solicitar({
      pasajeroId: 'p-1',
      origen: { lat: 0, lng: 0, direccion: 'O' },
      destino: { lat: 1, lng: 1, direccion: 'D' },
      tarifaEstimada: 100,
      distanciaKm: 1,
    });
    viaje.asignarConductor('c-1');
    viaje.iniciarViaje(); // Pasa a EN_CURSO

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viaje);
    viajeRepositoryMock.guardar.mockImplementation(async (v) => v);

    // Act
    const resultado = await useCase.ejecutar(viaje.id);

    // Assert
    expect(resultado.estado).toBe(EstadosViaje.COMPLETADO);
    expect(viajeRepositoryMock.guardar).toHaveBeenCalledWith(viaje);
    expect(generarPagoUseCaseMock.ejecutar).toHaveBeenCalledWith({
      viajeId: viaje.id,
      conductorId: 'c-1',
      montoTotal: 100,
    });
    expect(registrarBitacoraUseCaseMock.ejecutar).toHaveBeenCalled();
  });

  it('debería lanzar DomainException si el viaje no existe', async () => {
    // Arrange
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.ejecutar('id-invalido')).rejects.toThrow(DomainException);
    await expect(useCase.ejecutar('id-invalido')).rejects.toThrow(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
  });
});
