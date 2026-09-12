import '../../domain/entities/trip_history.dart';

class TripHistoryMapper {
  static TripHistory fromJson(Map<String, dynamic> json) {
    return TripHistory(
      id: json['id'] as String? ?? '',
      date: DateTime.tryParse(json['date'] as String? ?? '') ?? DateTime.now(),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] as String? ?? 'Desconocido',
      pickupLocation: json['pickupLocation'] as String? ?? '',
      dropoffLocation: json['dropoffLocation'] as String? ?? '',
      driverName: json['driverName'] as String? ?? 'No asignado',
      isCompleted: (json['status'] as String?)?.toLowerCase() == 'completado',
    );
  }

  static Map<String, dynamic> toJson(TripHistory entity) {
    return {
      'id': entity.id,
      'date': entity.date.toIso8601String(),
      'price': entity.price,
      'status': entity.status,
      'pickupLocation': entity.pickupLocation,
      'dropoffLocation': entity.dropoffLocation,
      'driverName': entity.driverName,
    };
  }
}
