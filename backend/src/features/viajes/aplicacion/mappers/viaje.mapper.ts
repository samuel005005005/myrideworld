import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ConductorResumenPublicoDto } from '../../../conductores/aplicacion/dto/conductor-resumen-publico.dto.js';
import { PasajeroResumenPublicoDto } from '../../../pasajeros/aplicacion/dto/pasajero-resumen-publico.dto.js';

export class ViajeMapper {
  static toResponse(
    viaje: Viaje,
    conductor?: ConductorResumenPublicoDto | null,
    pasajero?: PasajeroResumenPublicoDto | null,
  ) {
    return {
      id: viaje.id,
      pasajeroId: viaje.pasajeroId,
      conductorId: viaje.conductorId,
      origenLat: viaje.origenLat,
      origenLng: viaje.origenLng,
      destinoLat: viaje.destinoLat,
      destinoLng: viaje.destinoLng,
      origenDireccion: viaje.origenDireccion,
      destinoDireccion: viaje.destinoDireccion,
      estado: viaje.estado,
      tarifaEstimada: viaje.tarifaEstimada,
      fechaSolicitud: viaje.fechaSolicitud,
      fechaInicio: viaje.fechaInicio,
      fechaFin: viaje.fechaFin,
      conductor: conductor ?? null,
      pasajero: pasajero ?? null,
      pasajeroNombre: pasajero?.nombreCompleto ?? null,
      conductorNombre: conductor?.nombreCompleto ?? null,
    };
  }
}
