import { DomainException } from '../../../../../../src/compartidos/excepciones/domain.exception.js';
import { RechazarViajeUseCase } from '../../../../../../src/features/viajes/aplicacion/casos-uso/rechazar-viaje.use-case.js';
import { IViajeRepository } from '../../../../../../src/features/viajes/dominio/repositorios/viaje.repository.js';
import type { INotificadorViaje } from '../../../../../../src/features/viajes/aplicacion/puertos/notificador-viaje.port.js';
import { AsignadorConductorService } from '../../../../../../src/features/viajes/aplicacion/servicios/asignador-conductor.service.js';
import { OfertasViajeActivasRegistry } from '../../../../../../src/features/viajes/aplicacion/servicios/ofertas-viaje-activas.registry.js';
import { Viaje } from '../../../../../../src/features/viajes/dominio/entidades/viaje.entity.js';
import { Conductor } from '../../../../../../src/features/conductores/dominio/entidades/conductor.entity.js';
import { MENSAJES } from '../../../../../../src/compartidos/constantes/mensajes.const.js';
import { Roles } from '../../../../../../src/compartidos/constantes/roles.enum.js';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('RechazarViajeUseCase', () => {
  let useCase: RechazarViajeUseCase;
  let viajeRepositoryMock: Mocked<IViajeRepository>;
  let notificadorViajeMock: Mocked<INotificadorViaje>;
  let asignadorMock: Mocked<AsignadorConductorService>;
  let ofertas: OfertasViajeActivasRegistry;

  beforeEach(() => {
    viajeRepositoryMock = {
      obtenerPorId: vi.fn(),
      guardar: vi.fn(),
    } as any;

    notificadorViajeMock = {
      notificarNuevoViaje: vi.fn(),
      notificarViajeCancelado: vi.fn(),
      retirarOfertaDeConductor: vi.fn(),
    } as any;

    asignadorMock = {
      buscarCercanos: vi.fn(),
      buscarMasCercano: vi.fn(),
    } as any;

    ofertas = new OfertasViajeActivasRegistry();

    useCase = new RechazarViajeUseCase(
      viajeRepositoryMock,
      notificadorViajeMock,
      asignadorMock,
      ofertas,
    );
  });

  it('DebeLanzarExcepcion_CuandoViajeNoExiste', async () => {
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(null);

    await expect(useCase.ejecutar('viaje-1', 'cond-1')).rejects.toThrow(
      new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO),
    );
  });

  it('DebeOfertarASiguientes_CuandoNoQuedanOfertasActivas', async () => {
    const viajeMock = {
      id: 'viaje-1',
      origenLat: 10,
      origenLng: 10,
      destinoLat: 11,
      destinoLng: 11,
      tarifaEstimada: 25,
      conductoresRechazados: [] as string[],
      rechazar: vi.fn().mockImplementation(function (this: any, cId: string) {
        this.conductoresRechazados.push(cId);
        return true;
      }),
    } as unknown as Viaje;

    const conductorSiguiente = {
      id: 'cond-2',
      ultimaUbicacionLat: 10.1,
      ultimaUbicacionLng: 10.1,
    } as Conductor;

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);
    viajeRepositoryMock.guardar.mockResolvedValue(viajeMock);
    asignadorMock.buscarCercanos.mockResolvedValue([conductorSiguiente]);

    const result = await useCase.ejecutar('viaje-1', 'cond-1');

    expect(viajeMock.rechazar).toHaveBeenCalledWith('cond-1');
    expect(viajeRepositoryMock.guardar).toHaveBeenCalledWith(viajeMock);
    expect(notificadorViajeMock.retirarOfertaDeConductor).toHaveBeenCalledWith(
      'viaje-1',
      'cond-1',
    );
    expect(notificadorViajeMock.notificarNuevoViaje).toHaveBeenCalledWith(
      'cond-2',
      {
        id: 'viaje-1',
        origenLat: 10,
        origenLng: 10,
        destinoLat: 11,
        destinoLng: 11,
        tarifaEstimada: 25,
      },
    );
    expect(notificadorViajeMock.notificarViajeCancelado).not.toHaveBeenCalled();
    expect(result).toBe(viajeMock);
  });

  it('NoDebeBuscarSiguientes_CuandoOtrosSiguenConOferta', async () => {
    const viajeMock = {
      id: 'viaje-1',
      origenLat: 10,
      origenLng: 10,
      destinoLat: 11,
      destinoLng: 11,
      tarifaEstimada: 25,
      conductoresRechazados: [] as string[],
      rechazar: vi.fn().mockReturnValue(true),
    } as unknown as Viaje;

    ofertas.registrar('viaje-1', 'cond-1');
    ofertas.registrar('viaje-1', 'cond-2');
    notificadorViajeMock.retirarOfertaDeConductor.mockImplementation(
      (viajeId, conductorId) => {
        ofertas.liberarConductor(viajeId, conductorId);
      },
    );

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);
    viajeRepositoryMock.guardar.mockResolvedValue(viajeMock);

    await useCase.ejecutar('viaje-1', 'cond-1');

    expect(asignadorMock.buscarCercanos).not.toHaveBeenCalled();
    expect(notificadorViajeMock.notificarNuevoViaje).not.toHaveBeenCalled();
    expect(notificadorViajeMock.notificarViajeCancelado).not.toHaveBeenCalled();
  });

  it('DebeCancelarViaje_CuandoNoHayConductoresDisponibles', async () => {
    const viajeMock = {
      id: 'viaje-2',
      origenLat: 10,
      origenLng: 10,
      conductoresRechazados: [] as string[],
      rechazar: vi.fn().mockImplementation(function (this: any, cId: string) {
        this.conductoresRechazados.push(cId);
        return true;
      }),
      cancelar: vi.fn(),
    } as unknown as Viaje;

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);
    viajeRepositoryMock.guardar.mockResolvedValue(viajeMock);
    asignadorMock.buscarCercanos.mockResolvedValue([]);

    const result = await useCase.ejecutar('viaje-2', 'cond-1');

    expect(viajeMock.rechazar).toHaveBeenCalledWith('cond-1');
    expect(viajeMock.cancelar).toHaveBeenCalledWith(
      Roles.SISTEMA,
      'No hay conductores disponibles',
    );
    expect(viajeRepositoryMock.guardar).toHaveBeenCalledTimes(2);
    expect(notificadorViajeMock.notificarViajeCancelado).toHaveBeenCalledWith(
      'viaje-2',
      'SISTEMA',
      'No hay conductores disponibles en tu zona',
    );
    expect(notificadorViajeMock.notificarNuevoViaje).not.toHaveBeenCalled();
    expect(result).toBe(viajeMock);
  });

  it('DebeRetornarViaje_SinRotar_CuandoYaNoEsOfertable', async () => {
    const viajeMock = {
      id: 'viaje-3',
      rechazar: vi.fn().mockReturnValue(false),
      cancelar: vi.fn(),
    } as unknown as Viaje;

    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);

    const result = await useCase.ejecutar('viaje-3', 'cond-1');

    expect(viajeMock.rechazar).toHaveBeenCalledWith('cond-1');
    expect(viajeRepositoryMock.guardar).not.toHaveBeenCalled();
    expect(asignadorMock.buscarCercanos).not.toHaveBeenCalled();
    expect(notificadorViajeMock.notificarNuevoViaje).not.toHaveBeenCalled();
    expect(result).toBe(viajeMock);
  });
});
