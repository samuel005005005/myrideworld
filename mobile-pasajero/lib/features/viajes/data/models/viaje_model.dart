import '../../domain/entities/viaje.dart';

class ViajeModel extends Viaje {
  const ViajeModel({
    required super.id,
    required super.pasajeroId,
    super.conductorId,
    required super.estado,
    required super.tarifaEstimada,
    required super.origenLat,
    required super.origenLng,
    required super.destinoLat,
    required super.destinoLng,
    super.origenDireccion,
    super.destinoDireccion,
    required super.fechaCreacion,
    super.conductor,
  });
}
