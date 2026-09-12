import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/viaje.dart';
import '../models/viaje_model.dart';

class ViajeMapper {
  static ViajeModel fromApiData(Map<String, dynamic> data) {
    try {
      return ViajeModel(
        id: data['id'] as String,
        pasajeroId: data['pasajeroId'] as String? ?? '',
        conductorId: data['conductorId'] as String?,
        estado: data['estado'] as String? ?? '',
        tarifaEstimada: (data['tarifaEstimada'] as num?)?.toDouble() ?? 0,
        origenLat: (data['origenLat'] as num).toDouble(),
        origenLng: (data['origenLng'] as num).toDouble(),
        destinoLat: (data['destinoLat'] as num).toDouble(),
        destinoLng: (data['destinoLng'] as num).toDouble(),
        fechaCreacion:
            DateTime.tryParse(
              data['fechaCreacion'] as String? ??
                  data['fechaSolicitud'] as String? ??
                  '',
            ) ??
            DateTime.now(),
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
      fechaCreacion: modelo.fechaCreacion,
    );
  }
}
