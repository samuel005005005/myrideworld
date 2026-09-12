import '../../domain/entities/receipt.dart';

class ReceiptMapper {
  static Receipt fromJson(Map<String, dynamic> json) {
    return Receipt(
      tripId: json['tripId'] as String? ?? '',
      baseFare: (json['baseFare'] as num?)?.toDouble() ?? 0.0,
      tipAmount: (json['tipAmount'] as num?)?.toDouble() ?? 0.0,
      taxes: (json['taxes'] as num?)?.toDouble() ?? 0.0,
      total: (json['total'] as num?)?.toDouble() ?? 0.0,
      paymentStatus: json['paymentStatus'] as String? ?? 'PENDIENTE',
    );
  }

  static Map<String, dynamic> toJson(Receipt entity) {
    return {
      'tripId': entity.tripId,
      'baseFare': entity.baseFare,
      'tipAmount': entity.tipAmount,
      'taxes': entity.taxes,
      'total': entity.total,
      'paymentStatus': entity.paymentStatus,
    };
  }
}
