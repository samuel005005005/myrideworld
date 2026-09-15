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
      tarifaEstimada: _aDouble(json['tarifaEstimada']),
      origenLat: _aDouble(json['origenLat']),
      origenLng: _aDouble(json['origenLng']),
      destinoLat: _aDouble(json['destinoLat']),
      destinoLng: _aDouble(json['destinoLng']),
      origenDireccion: _textoOpcional(json['origenDireccion']),
      destinoDireccion: _textoOpcional(json['destinoDireccion']),
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
      'origenDireccion': viaje.origenDireccion,
      'destinoDireccion': viaje.destinoDireccion,
      'fechaCreacion': viaje.fechaCreacion.toIso8601String(),
    };
  }

  static double _aDouble(Object? valor) {
    if (valor is num) {
      return valor.toDouble();
    }
    if (valor is String) {
      return double.parse(valor);
    }
    throw FormatException('Valor numérico inválido: $valor');
  }

  static String? _textoOpcional(Object? valor) {
    if (valor is! String) {
      return null;
    }
    final texto = valor.trim();
    return texto.isEmpty ? null : texto;
  }
}
