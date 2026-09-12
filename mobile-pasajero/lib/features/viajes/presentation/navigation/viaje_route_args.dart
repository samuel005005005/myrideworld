import '../../domain/entities/recibo_viaje.dart';
import '../../domain/entities/viaje.dart';

String? resolverViajeId(Object? extra) {
  if (extra is String && extra.isNotEmpty) {
    return extra;
  }

  if (extra is Viaje) {
    return extra.id;
  }

  if (extra is Map) {
    final map = Map<String, dynamic>.from(extra);
    final id = map['id'] ?? map['viajeId'];
    return id?.toString();
  }

  return null;
}

ReciboViaje resolverRecibo(Object? extra) {
  if (extra is ReciboViaje) {
    return extra;
  }

  if (extra is Map) {
    final map = Map<String, dynamic>.from(extra);
    return ReciboViaje(
      tarifa: (map['tarifa'] as num?)?.toDouble() ??
          (map['tarifaEstimada'] as num?)?.toDouble() ??
          0,
      distancia: (map['distancia'] as num?)?.toDouble() ?? 0,
      duracionMinutos: (map['duracionMinutos'] as num?)?.toInt() ?? 0,
    );
  }

  return const ReciboViaje(tarifa: 0, distancia: 0, duracionMinutos: 0);
}
