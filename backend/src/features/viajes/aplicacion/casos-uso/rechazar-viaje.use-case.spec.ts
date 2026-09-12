import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { RechazarViajeUseCase } from './rechazar-viaje.use-case.js';
import { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Conductor } from '../../../conductores/dominio/entidades/conductor.entity.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';
import * as geoUtil from '../../../../compartidos/utilidades/geo.util.js';

vi.mock('../../../../compartidos/utilidades/geo.util.js', () => ({
  calcularDistanciaKm: vi.fn(),
}));

describe('RechazarViajeUseCase', () => {
  let useCase: RechazarViajeUseCase;
  let viajeRepositoryMock: Mocked<IViajeRepository>;
  let conductorRepositoryMock: Mocked<IConductorRepository>;
  let notificadorViajeMock: Mocked<INotificadorViaje>;

  beforeEach(() => {
    viajeRepositoryMock = {
      obtenerPorId: vi.fn(),
      guardar: vi.fn(),
    } as any;

    conductorRepositoryMock = {
      obtenerDisponibles: vi.fn(),
    } as any;

    notificadorViajeMock = {
      notificarNuevoViaje: vi.fn(),
      notificarViajeCancelado: vi.fn(),
    } as any;

    useCase = new RechazarViajeUseCase(
      viajeRepositoryMock,
      conductorRepositoryMock,
      notificadorViajeMock,
    );
  });

  it('DebeLanzarExcepcion_CuandoViajeNoExiste', async () => {
    // Arrange
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.ejecutar('viaje-1', 'cond-1')).rejects.toThrow(
      new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO)
    );
  });

  it('DebeAsignarSiguienteConductor_CuandoHayConductoresDisponibles', async () => {
    // Arrange
    const viajeMock = {
      id: 'viaje-1',
      origenLat: 10,
      origenLng: 10,
      destinoLat: 11,
      destinoLng: 11,
      tarifaEstimada: 25,
      conductoresRechazados: [],
      rechazar: vi.fn().mockImplementation(function (this: any, cId: string) {
        this.conductoresRechazados.push(cId);
      }),
    } as unknown as Viaje;

    const conductorSiguiente = {
      id: 'cond-2',
      ultimaUbicacionLat: 10.1,
      ultimaUbicacionLng: 10.1,
    } as Conductor;

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);
    viajeRepositoryMock.guardar.mockResolvedValue(viajeMock);
    conductorRepositoryMock.obtenerDisponibles.mockResolvedValue([conductorSiguiente]);
    vi.mocked(geoUtil.calcularDistanciaKm).mockReturnValue(5);

    // Act
    const result = await useCase.ejecutar('viaje-1', 'cond-1');

    // Assert
    expect(viajeMock.rechazar).toHaveBeenCalledWith('cond-1');
    expect(viajeRepositoryMock.guardar).toHaveBeenCalledWith(viajeMock);
    expect(notificadorViajeMock.notificarNuevoViaje).toHaveBeenCalledWith('cond-2', {
      id: 'viaje-1',
      origenLat: 10,
      origenLng: 10,
      destinoLat: 11,
      destinoLng: 11,
      tarifaEstimada: 25,
    });
    expect(notificadorViajeMock.notificarViajeCancelado).not.toHaveBeenCalled();
    expect(result).toBe(viajeMock);
  });

  it('DebeCancelarViaje_CuandoNoHayConductoresDisponibles', async () => {
    // Arrange
    const viajeMock = {
      id: 'viaje-2',
      origenLat: 10,
      origenLng: 10,
      conductoresRechazados: [],
      rechazar: vi.fn().mockImplementation(function (this: any, cId: string) {
        this.conductoresRechazados.push(cId);
      }),
      cancelar: vi.fn(),
    } as unknown as Viaje;

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);
    viajeRepositoryMock.guardar.mockResolvedValue(viajeMock);
    conductorRepositoryMock.obtenerDisponibles.mockResolvedValue([]); // Vacio

    // Act
    const result = await useCase.ejecutar('viaje-2', 'cond-1');

    // Assert
    expect(viajeMock.rechazar).toHaveBeenCalledWith('cond-1');
    expect(viajeMock.cancelar).toHaveBeenCalledWith(Roles.SISTEMA, 'No hay conductores disponibles');
    expect(viajeRepositoryMock.guardar).toHaveBeenCalledTimes(2); // Uno al rechazar, otro al cancelar
    expect(notificadorViajeMock.notificarViajeCancelado).toHaveBeenCalledWith(
      'viaje-2',
      'SISTEMA',
      'No hay conductores disponibles en tu zona'
    );
    expect(notificadorViajeMock.notificarNuevoViaje).not.toHaveBeenCalled();
    expect(result).toBe(viajeMock);
  });
});
