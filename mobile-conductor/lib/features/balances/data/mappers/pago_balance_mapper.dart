import '../../domain/entities/pago_balance.dart';

class PagoBalanceMapper {
  static PagoBalance fromJson(Map<String, dynamic> json) {
    return PagoBalance(
      id: json['id'] as String,
      viajeId: json['viajeId'] as String,
      montoBruto: (json['montoBruto'] as num).toDouble(),
      feeProcesamiento: (json['feeProcesamiento'] as num).toDouble(),
      montoNeto: (json['montoNeto'] as num).toDouble(),
      metodo: json['metodo'] as String? ?? 'Efectivo',
      fecha: DateTime.tryParse(json['fecha']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}
