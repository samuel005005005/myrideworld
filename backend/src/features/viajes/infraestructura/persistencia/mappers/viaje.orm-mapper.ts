import { Viaje } from '../../../dominio/entidades/viaje.entity.js';
import { ViajeOrmEntity } from '../entidades/viaje.orm-entity.js';
import { EstadosViaje } from '../../../../../compartidos/constantes/estados-viaje.enum.js';
import { Roles } from '../../../../../compartidos/constantes/roles.enum.js';

export class ViajeOrmMapper {
  static toDomain(entity: ViajeOrmEntity): Viaje {
    return Viaje.solicitar({
      id: entity.id,
      pasajeroId: entity.pasajeroId,
      conductorId: entity.conductorId ?? undefined,
      origenLat: entity.origenLat,
      origenLng: entity.origenLng,
      destinoLat: entity.destinoLat,
      destinoLng: entity.destinoLng,
      estado: entity.estado as EstadosViaje,
      tarifaEstimada: entity.tarifaEstimada,
      metodoPago: entity.metodoPago ?? undefined,
      canceladoPor: (entity.canceladoPor as Roles) ?? undefined,
      motivoCancelacion: entity.motivoCancelacion ?? undefined,
      fechaSolicitud: entity.fechaSolicitud,
      fechaInicio: entity.fechaInicio ?? undefined,
      fechaFin: entity.fechaFin ?? undefined,
      conductoresRechazados: entity.conductoresRechazados ?? [],
    });
  }

  static toOrm(viaje: Viaje): Partial<ViajeOrmEntity> {
    return {
      id: viaje.id,
      pasajeroId: viaje.pasajeroId,
      conductorId: viaje.conductorId ?? undefined,
      origenLat: viaje.origenLat,
      origenLng: viaje.origenLng,
      destinoLat: viaje.destinoLat,
      destinoLng: viaje.destinoLng,
      estado: viaje.estado,
      tarifaEstimada: viaje.tarifaEstimada,
      metodoPago: viaje.metodoPago ?? undefined,
      canceladoPor: viaje.canceladoPor ?? undefined,
      motivoCancelacion: viaje.motivoCancelacion ?? undefined,
      fechaSolicitud: viaje.fechaSolicitud,
      fechaInicio: viaje.fechaInicio ?? undefined,
      fechaFin: viaje.fechaFin ?? undefined,
      conductoresRechazados: viaje.conductoresRechazados,
    };
  }
}
