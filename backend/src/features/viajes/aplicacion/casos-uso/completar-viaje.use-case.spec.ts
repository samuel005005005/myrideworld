import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CompletarViajeUseCase } from './completar-viaje.use-case.js';
import { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
import { RegistrarBitacoraUseCase } from '../../../bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

describe('CompletarViajeUseCase', () => {
  let useCase: CompletarViajeUseCase;
  let viajeRepositoryMock: {
    obtenerPorId: Mock;
    listarTodos: Mock;
    guardar: Mock;
    eliminar: Mock;
    obtenerPorConductorYEstado: Mock;
  };
  let notificadorViajeMock: { notificarViajeCompletado: Mock };
  let generarPagoUseCaseMock: { ejecutar: Mock };
  let registrarBitacoraUseCaseMock: { ejecutar: Mock };

  beforeEach(() => {
    viajeRepositoryMock = {
      obtenerPorId: vi.fn(),
      listarTodos: vi.fn(),
      guardar: vi.fn(),
      eliminar: vi.fn(),
      obtenerPorConductorYEstado: vi.fn(),
    };

    notificadorViajeMock = {
      notificarViajeCompletado: vi.fn(),
    };

    generarPagoUseCaseMock = {
      ejecutar: vi.fn(),
    };

    registrarBitacoraUseCaseMock = {
      ejecutar: vi.fn(),
    };

    useCase = new CompletarViajeUseCase(
      viajeRepositoryMock as unknown as IViajeRepository,
      notificadorViajeMock as unknown as INotificadorViaje,
      generarPagoUseCaseMock as unknown as GenerarPagoUseCase,
      registrarBitacoraUseCaseMock as unknown as RegistrarBitacoraUseCase,
    );
  });

  it('debería completar un viaje exitosamente', async () => {
    const viaje = Viaje.solicitar({
      pasajeroId: 'p-1',
      origenLat: 0,
      origenLng: 0,
      destinoLat: 1,
      destinoLng: 1,
      tarifaEstimada: 100,
    });
    viaje.asignarConductor('c-1');
    viaje.iniciarViaje();

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viaje);
    viajeRepositoryMock.guardar.mockImplementation(async (v) => v);

    const resultado = await useCase.ejecutar(viaje.id);

    expect(resultado.estado).toBe(EstadosViaje.COMPLETADO);
    expect(viajeRepositoryMock.guardar).toHaveBeenCalledWith(viaje);
    expect(generarPagoUseCaseMock.ejecutar).toHaveBeenCalledWith({
      viajeId: viaje.id,
      conductorId: 'c-1',
      montoTotal: 100,
    });
    expect(registrarBitacoraUseCaseMock.ejecutar).toHaveBeenCalled();
    expect(notificadorViajeMock.notificarViajeCompletado).toHaveBeenCalledWith(viaje.id, 100);
  });

  it('debería lanzar DomainException si el viaje no existe', async () => {
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(null);

    await expect(useCase.ejecutar('id-invalido')).rejects.toThrow(DomainException);
    await expect(useCase.ejecutar('id-invalido')).rejects.toThrow(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
  });
});
