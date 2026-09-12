import '../../domain/entities/viaje.dart';

Viaje? resolverViajeNavegacion(Object? extra) {
  if (extra is Viaje) {
    return extra;
  }

  if (extra is Map) {
    final data = Map<String, dynamic>.from(extra);
    try {
      return Viaje(
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
            DateTime.tryParse(data['fechaCreacion'] as String? ?? '') ??
            DateTime.now(),
      );
    } catch (_) {
      return null;
    }
  }

  return null;
}
