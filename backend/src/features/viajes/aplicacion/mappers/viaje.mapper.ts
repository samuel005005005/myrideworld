import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ConductorResumenPublicoDto } from '../../../conductores/aplicacion/dto/conductor-resumen-publico.dto.js';

export class ViajeMapper {
  static toResponse(
    viaje: Viaje,
    conductor?: ConductorResumenPublicoDto | null,
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
    };
  }
}
