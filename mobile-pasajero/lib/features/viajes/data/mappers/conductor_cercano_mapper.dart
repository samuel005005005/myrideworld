import '../../domain/entities/conductor_cercano.dart';

class ConductorCercanoMapper {
  static ConductorCercano fromJson(Map<String, dynamic> json) {
    return ConductorCercano(
      id: json['id'] as String? ?? json['conductorId'] as String,
      latitud: (json['lat'] as num).toDouble(),
      longitud: (json['lng'] as num).toDouble(),
      vehiculoColor: json['vehiculoColor'] as String? ?? '',
    );
  }
}
