import '../../domain/entities/recibo_viaje.dart';

class ReciboViajeMapper {
  static ReciboViaje fromJson(Map<String, dynamic> payload) {
    return ReciboViaje(
      tarifa: _toDouble(payload['tarifa'] ?? payload['tarifaEstimada']),
      distancia: _toDouble(
        payload['distancia'] ?? payload['distanciaKm'],
      ),
      duracionMinutos: _toInt(payload['duracionMinutos']),
    );
  }

  static ReciboViaje fromEventoCompletado(Map<String, dynamic> payload) {
    return fromJson(payload);
  }

  static double _toDouble(dynamic valor) {
    if (valor is num) {
      return valor.toDouble();
    }
    if (valor is String) {
      return double.tryParse(valor) ?? 0;
    }
    return 0;
  }

  static int _toInt(dynamic valor) {
    if (valor is num) {
      return valor.toInt();
    }
    if (valor is String) {
      return int.tryParse(valor) ?? 0;
    }
    return 0;
  }
}
