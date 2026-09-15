import '../entities/coordenada_conductor.dart';

class RutaViaje {
  final List<CoordenadaConductor> puntos;
  final double distanciaKm;
  final int duracionMinutos;

  const RutaViaje({
    required this.puntos,
    required this.distanciaKm,
    required this.duracionMinutos,
  });
}
