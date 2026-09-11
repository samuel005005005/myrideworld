import { NotFoundException } from '@nestjs/common';
import { CalificarConductorUseCase } from './calificar-conductor.use-case.js';
import { ICalificacionRepository } from '../../dominio/repositorios/calificacion.repository.js';
import { IViajeRepository } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { Viaje } from '../../../viajes/dominio/entidades/viaje.entity.js';
import { Calificacion } from '../../dominio/entidades/calificacion.entity.js';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('CalificarConductorUseCase', () => {
  let useCase: CalificarConductorUseCase;
  let calificacionRepositoryMock: Mocked<ICalificacionRepository>;
  let viajeRepositoryMock: Mocked<IViajeRepository>;

  beforeEach(() => {
    calificacionRepositoryMock = {
      guardar: vi.fn(),
      existeCalificacion: vi.fn(),
    } as any;

    viajeRepositoryMock = {
      obtenerPorId: vi.fn(),
    } as any;

    useCase = new CalificarConductorUseCase(
      calificacionRepositoryMock,
      viajeRepositoryMock,
    );
  });

  it('DebeLanzarExcepcion_CuandoViajeNoExiste', async () => {
    // Arrange
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.ejecutar('pasajero-1', { viajeId: 'viaje-1', puntuacion: 5 })).rejects.toThrow(
      new NotFoundException(MENSAJES.EXCEPCIONES.CALIFICACIONES.NO_ENCONTRADO)
    );
  });

  it('DebeLanzarExcepcion_CuandoNoEsElPasajeroDelViaje', async () => {
    // Arrange
    const viajeMock = { id: 'viaje-1', pasajeroId: 'pasajero-2' } as Viaje;
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);

    // Act & Assert
    await expect(useCase.ejecutar('pasajero-1', { viajeId: 'viaje-1', puntuacion: 5 })).rejects.toThrow(
      new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.SOLO_PASAJERO_CALIFICA)
    );
  });

  it('DebeLanzarExcepcion_CuandoViajeNoEstaCompletado', async () => {
    // Arrange
    const viajeMock = { id: 'viaje-1', pasajeroId: 'pasajero-1', estado: EstadosViaje.EN_CURSO } as Viaje;
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);

    // Act & Assert
    await expect(useCase.ejecutar('pasajero-1', { viajeId: 'viaje-1', puntuacion: 5 })).rejects.toThrow(
      new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.SOLO_COMPLETADOS)
    );
  });

  it('DebeLanzarExcepcion_CuandoViajeYaFueCalificado', async () => {
    // Arrange
    const viajeMock = { id: 'viaje-1', pasajeroId: 'pasajero-1', estado: EstadosViaje.COMPLETADO } as Viaje;
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);
    calificacionRepositoryMock.existeCalificacion.mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.ejecutar('pasajero-1', { viajeId: 'viaje-1', puntuacion: 5 })).rejects.toThrow(
      new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.YA_CALIFICADO)
    );
  });

  it('DebeCrearYGuardarCalificacion_CuandoDatosSonValidos', async () => {
    // Arrange
    const viajeMock = { id: 'viaje-1', pasajeroId: 'pasajero-1', conductorId: 'conductor-1', estado: EstadosViaje.COMPLETADO } as Viaje;
    viajeRepositoryMock.obtenerPorId.mockResolvedValue(viajeMock);
    calificacionRepositoryMock.existeCalificacion.mockResolvedValue(false);
    
    // El mock debe retornar lo que se le pase
    calificacionRepositoryMock.guardar.mockImplementation(async (c) => c);

    // Act
    const result = await useCase.ejecutar('pasajero-1', {
      viajeId: 'viaje-1',
      puntuacion: 4,
      comentario: 'Buen viaje'
    });

    // Assert
    expect(result.puntuacion).toBe(4);
    expect(result.comentario).toBe('Buen viaje');
    expect(result.viajeId).toBe('viaje-1');
    expect(calificacionRepositoryMock.guardar).toHaveBeenCalled();
  });
});
