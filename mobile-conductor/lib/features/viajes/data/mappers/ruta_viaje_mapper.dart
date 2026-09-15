import '../../domain/entities/coordenada_conductor.dart';
import '../models/ruta_viaje_model.dart';

class RutaViajeMapper {
  static RutaViajeModel fromJson(Map<String, dynamic> json) {
    final rutas = json['routes'] as List<dynamic>? ?? <dynamic>[];
    if (rutas.isEmpty) {
      return const RutaViajeModel(
        puntos: <CoordenadaConductor>[],
        distanciaKm: 0,
        duracionMinutos: 0,
      );
    }

    final ruta = rutas.first as Map<String, dynamic>;
    final geometry =
        ruta['geometry'] as Map<String, dynamic>? ?? <String, dynamic>{};
    final coordenadas =
        geometry['coordinates'] as List<dynamic>? ?? <dynamic>[];
    final puntos = coordenadas
        .map(
          (coord) => CoordenadaConductor(
            latitud: (coord[1] as num).toDouble(),
            longitud: (coord[0] as num).toDouble(),
          ),
        )
        .toList();

    return RutaViajeModel(
      puntos: puntos,
      distanciaKm: ((ruta['distance'] as num?)?.toDouble() ?? 0) / 1000,
      duracionMinutos: (((ruta['duration'] as num?)?.toDouble() ?? 0) / 60)
          .ceil(),
    );
  }
}
