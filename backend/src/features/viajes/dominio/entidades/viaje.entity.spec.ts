import { describe, it, expect, beforeEach } from 'vitest';
import { Viaje } from './viaje.entity.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

describe('Viaje Entity', () => {
  let viaje: Viaje;

  beforeEach(() => {
    // Arrange: Preparamos un viaje base para cada test
    viaje = Viaje.solicitar({
      pasajeroId: 'pasajero-1',
      origen: { lat: 10, lng: -10, direccion: 'Origen' },
      destino: { lat: 20, lng: -20, direccion: 'Destino' },
      tarifaEstimada: 150,
      distanciaKm: 5,
    });
  });

  describe('Creación (solicitar)', () => {
    it('debería crear un viaje en estado SOLICITADO con los datos correctos', () => {
      // Act & Assert
      expect(viaje.id).toBeDefined();
      expect(viaje.estado).toBe(EstadosViaje.SOLICITADO);
      expect(viaje.pasajeroId).toBe('pasajero-1');
      expect(viaje.tarifaEstimada).toBe(150);
    });

    it('debería lanzar DomainException si falta pasajeroId', () => {
      // Act & Assert
      expect(() => {
        Viaje.solicitar({
          pasajeroId: '',
          origen: { lat: 10, lng: -10, direccion: 'Origen' },
          destino: { lat: 20, lng: -20, direccion: 'Destino' },
          tarifaEstimada: 150,
          distanciaKm: 5,
        });
      }).toThrow(DomainException);
      
      expect(() => {
        Viaje.solicitar({
          pasajeroId: '',
          origen: { lat: 10, lng: -10, direccion: 'Origen' },
          destino: { lat: 20, lng: -20, direccion: 'Destino' },
          tarifaEstimada: 150,
          distanciaKm: 5,
        });
      }).toThrow(MENSAJES.EXCEPCIONES.VIAJES.PASAJERO_ID_OBLIGATORIO);
    });
  });

  describe('Transiciones de Estado', () => {
    it('debería asignar un conductor correctamente si está SOLICITADO', () => {
      // Arrange
      const conductorId = 'conductor-1';

      // Act
      viaje.asignarConductor(conductorId);

      // Assert
      expect(viaje.estado).toBe(EstadosViaje.ASIGNADO);
      expect(viaje.conductorId).toBe(conductorId);
    });

    it('debería lanzar DomainException si se intenta asignar un conductor a un viaje ya EN_CURSO', () => {
      // Arrange
      viaje.asignarConductor('conductor-1');
      viaje.iniciarViaje(); // Pasa a EN_CURSO

      // Act & Assert
      expect(() => viaje.asignarConductor('conductor-2')).toThrow(DomainException);
      expect(() => viaje.asignarConductor('conductor-2')).toThrow(MENSAJES.EXCEPCIONES.VIAJES.NO_DISPONIBLE_ASIGNACION);
    });

    it('debería completar el viaje correctamente si está EN_CURSO', () => {
      // Arrange
      viaje.asignarConductor('conductor-1');
      viaje.iniciarViaje(); // EN_CURSO

      // Act
      viaje.completarViaje();

      // Assert
      expect(viaje.estado).toBe(EstadosViaje.COMPLETADO);
      expect(viaje.fechaFin).toBeDefined();
    });

    it('debería lanzar DomainException si se intenta completar un viaje que no está EN_CURSO', () => {
      // Act & Assert (El viaje está en SOLICITADO)
      expect(() => viaje.completarViaje()).toThrow(DomainException);
      expect(() => viaje.completarViaje()).toThrow(MENSAJES.EXCEPCIONES.VIAJES.SOLO_CURSO_COMPLETAR);
    });
  });
});
