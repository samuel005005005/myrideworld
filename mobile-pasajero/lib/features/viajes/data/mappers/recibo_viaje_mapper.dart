import '../../domain/entities/recibo_viaje.dart';

class ReciboViajeMapper {
  static ReciboViaje fromJson(Map<String, dynamic> payload) {
    return ReciboViaje(
      tarifa: _toDouble(payload['tarifa'] ?? payload['tarifaEstimada']),
      distancia: _toDouble(payload['distancia']),
      duracionMinutos: _toInt(payload['duracionMinutos']),
    );
  }

  static ReciboViaje fromEventoCompletado(Map<String, dynamic> payload) {
    return fromJson(payload);
  }

  static double _toDouble(dynamic valor) {
    return (valor as num?)?.toDouble() ?? 0;
  }

  static int _toInt(dynamic valor) {
    return (valor as num?)?.toInt() ?? 0;
  }
}
