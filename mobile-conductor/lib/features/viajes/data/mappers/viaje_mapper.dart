import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/viaje.dart';
import '../models/viaje_model.dart';
import 'pasajero_asignado_mapper.dart';

class ViajeMapper {
  static ViajeModel fromApiData(Map<String, dynamic> data) {
    try {
      final pasajeroRaw = data['pasajero'];
      return ViajeModel(
        id: data['id'] as String,
        pasajeroId: data['pasajeroId'] as String? ?? '',
        conductorId: data['conductorId'] as String?,
        estado: data['estado'] as String? ?? '',
        tarifaEstimada: _aDouble(data['tarifaEstimada']) ?? 0,
        origenLat: _aDouble(data['origenLat'])!,
        origenLng: _aDouble(data['origenLng'])!,
        destinoLat: _aDouble(data['destinoLat'])!,
        destinoLng: _aDouble(data['destinoLng'])!,
        origenDireccion: _textoOpcional(data['origenDireccion']),
        destinoDireccion: _textoOpcional(data['destinoDireccion']),
        fechaCreacion:
            DateTime.tryParse(
              data['fechaCreacion'] as String? ??
                  data['fechaSolicitud'] as String? ??
                  '',
            ) ??
            DateTime.now(),
        pasajero: PasajeroAsignadoMapper.fromJson(
          pasajeroRaw is Map
              ? Map<String, dynamic>.from(pasajeroRaw)
              : null,
        ),
      );
    } catch (_) {
      throw const AppException(AppStrings.errorViajeInvalido);
    }
  }

  static Viaje toDomain(ViajeModel modelo) {
    return Viaje(
      id: modelo.id,
      pasajeroId: modelo.pasajeroId,
      conductorId: modelo.conductorId,
      estado: modelo.estado,
      tarifaEstimada: modelo.tarifaEstimada,
      origenLat: modelo.origenLat,
      origenLng: modelo.origenLng,
      destinoLat: modelo.destinoLat,
      destinoLng: modelo.destinoLng,
      origenDireccion: modelo.origenDireccion,
      destinoDireccion: modelo.destinoDireccion,
      fechaCreacion: modelo.fechaCreacion,
      pasajero: modelo.pasajero,
    );
  }

  static String? _textoOpcional(Object? valor) {
    if (valor is! String) {
      return null;
    }
    final texto = valor.trim();
    return texto.isEmpty ? null : texto;
  }

  static double? _aDouble(Object? valor) {
    if (valor == null) {
      return null;
    }
    if (valor is num) {
      return valor.toDouble();
    }
    if (valor is String) {
      return double.tryParse(valor);
    }
    return null;
  }
}
