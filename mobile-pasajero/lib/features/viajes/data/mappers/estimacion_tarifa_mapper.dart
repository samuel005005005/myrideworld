import '../../domain/entities/estimacion_tarifa.dart';
import '../../domain/entities/tipo_viaje_tarifa.dart';

class EstimacionTarifaMapper {
  static EstimacionTarifa fromJson(Map<String, dynamic> json) {
    return EstimacionTarifa(
      precio: (json['precio'] as num).toDouble(),
      distanciaKm: (json['distanciaKm'] as num).toDouble(),
      tarifaId: json['tarifaId'] as String,
      tipoViaje: TipoViajeTarifa.desdeApi(
        json['tipoViaje']?.toString(),
      ),
    );
  }
}
