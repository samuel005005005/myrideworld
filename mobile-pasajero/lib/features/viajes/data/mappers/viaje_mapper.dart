import '../../domain/entities/viaje.dart';
import '../models/viaje_model.dart';
import 'conductor_asignado_mapper.dart';

class ViajeMapper {
  static ViajeModel fromJson(Map<String, dynamic> json) {
    final conductorJson = json['conductor'];
    return ViajeModel(
      id: json['id'] as String,
      pasajeroId: json['pasajeroId'] as String,
      conductorId: json['conductorId'] as String?,
      estado: json['estado'] as String,
      tarifaEstimada: (json['tarifaEstimada'] as num).toDouble(),
      origenLat: (json['origenLat'] as num).toDouble(),
      origenLng: (json['origenLng'] as num).toDouble(),
      destinoLat: (json['destinoLat'] as num).toDouble(),
      destinoLng: (json['destinoLng'] as num).toDouble(),
      fechaCreacion:
          DateTime.tryParse(
            json['fechaCreacion'] as String? ??
                json['fechaSolicitud'] as String? ??
                '',
          ) ??
          DateTime.now(),
      conductor: conductorJson is Map
          ? ConductorAsignadoMapper.fromJson(
              Map<String, dynamic>.from(conductorJson),
            )
          : null,
    );
  }

  static Map<String, dynamic> toJson(Viaje viaje) {
    return {
      'id': viaje.id,
      'pasajeroId': viaje.pasajeroId,
      'conductorId': viaje.conductorId,
      'estado': viaje.estado,
      'tarifaEstimada': viaje.tarifaEstimada,
      'origenLat': viaje.origenLat,
      'origenLng': viaje.origenLng,
      'destinoLat': viaje.destinoLat,
      'destinoLng': viaje.destinoLng,
      'fechaCreacion': viaje.fechaCreacion.toIso8601String(),
    };
  }
}
