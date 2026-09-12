import '../../domain/entities/ruta_viaje.dart';

class RutaViajeModel extends RutaViaje {
  const RutaViajeModel({
    required super.puntos,
    required super.distanciaKm,
    required super.duracionMinutos,
  });
}
