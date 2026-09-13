import '../../../../core/tipos/resultado.dart';

abstract class DisponibilidadRepository {
  Future<Resultado<void>> actualizarDisponibilidad({
    required bool disponible,
    double? latitud,
    double? longitud,
  });

  Future<Resultado<void>> actualizarUbicacion({
    required double latitud,
    required double longitud,
  });
}
