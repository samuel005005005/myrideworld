import { Viaje } from '../../dominio/entidades/viaje.entity.js';

export class ViajeMapper {
  static toResponse(viaje: Viaje) {
    return {
      id: viaje.id,
      pasajeroId: viaje.pasajeroId,
      conductorId: viaje.conductorId,
      origenLat: viaje.origenLat,
      origenLng: viaje.origenLng,
      destinoLat: viaje.destinoLat,
      destinoLng: viaje.destinoLng,
      estado: viaje.estado,
      tarifaEstimada: viaje.tarifaEstimada,
      fechaSolicitud: viaje.fechaSolicitud,
      fechaInicio: viaje.fechaInicio,
      fechaFin: viaje.fechaFin,
    };
  }
}
