import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { CompletarViajeUseCase } from '../../../../../../src/features/viajes/aplicacion/casos-uso/completar-viaje.use-case.js';
import type { IViajeRepository } from '../../../../../../src/features/viajes/dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../../../../../src/features/viajes/dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../../../../../../src/features/viajes/aplicacion/puertos/notificador-viaje.port.js';
import { GenerarPagoUseCase } from '../../../../../../src/features/pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
import { RegistrarBitacoraUseCase } from '../../../../../../src/features/bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { DomainException } from '../../../../../../src/compartidos/excepciones/domain.exception.js';
import { EstadosViaje } from '../../../../../../src/compartidos/constantes/estados-viaje.enum.js';
import { MENSAJES } from '../../../../../../src/compartidos/constantes/mensajes.const.js';
import { ValidadorProximidadViajeService } from '../../../../../../src/features/viajes/aplicacion/servicios/validador-proximidad-viaje.service.js';

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
  let validadorProximidadMock: { asegurarCercaDe: Mock };

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

    validadorProximidadMock = {
      asegurarCercaDe: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new CompletarViajeUseCase(
      viajeRepositoryMock as unknown as IViajeRepository,
      notificadorViajeMock as unknown as INotificadorViaje,
      generarPagoUseCaseMock as unknown as GenerarPagoUseCase,
      registrarBitacoraUseCaseMock as unknown as RegistrarBitacoraUseCase,
      validadorProximidadMock as unknown as ValidadorProximidadViajeService,
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

    const resultado = await useCase.ejecutar(viaje.id, 'c-1');

    expect(resultado.estado).toBe(EstadosViaje.COMPLETADO);
    expect(validadorProximidadMock.asegurarCercaDe).toHaveBeenCalledWith(
      'c-1',
      1,
      1,
      MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_RADIO_PROXIMIDAD_DESTINO_M,
    );
    expect(viajeRepositoryMock.guardar).toHaveBeenCalledWith(viaje);
    expect(generarPagoUseCaseMock.ejecutar).toHaveBeenCalledWith({
      viajeId: viaje.id,
      conductorId: 'c-1',
      montoTotal: 100,
    });
    expect(registrarBitacoraUseCaseMock.ejecutar).toHaveBeenCalled();
    expect(notificadorViajeMock.notificarViajeCompletado).toHaveBeenCalledWith(
      viaje.id,
      100,
    );
  });

  it('debería lanzar DomainException si el viaje no existe', async () => {
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(null);

    await expect(useCase.ejecutar('id-invalido', 'c-1')).rejects.toThrow(
      DomainException,
    );
    await expect(useCase.ejecutar('id-invalido', 'c-1')).rejects.toThrow(
      MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO,
    );
  });

  it('debería fallar si la proximidad GPS no es válida', async () => {
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
    validadorProximidadMock.asegurarCercaDe.mockRejectedValue(
      new DomainException(MENSAJES.EXCEPCIONES.VIAJES.GPS_CONDUCTOR_REQUERIDO),
    );

    await expect(useCase.ejecutar(viaje.id, 'c-1')).rejects.toThrow(
      MENSAJES.EXCEPCIONES.VIAJES.GPS_CONDUCTOR_REQUERIDO,
    );
    expect(viajeRepositoryMock.guardar).not.toHaveBeenCalled();
  });
});
