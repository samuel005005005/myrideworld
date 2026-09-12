import 'coordenada.dart';

class RutaViaje {
  final List<Coordenada> puntos;
  final double distanciaKm;
  final int duracionMinutos;

  const RutaViaje({
    required this.puntos,
    required this.distanciaKm,
    required this.duracionMinutos,
  });
}
