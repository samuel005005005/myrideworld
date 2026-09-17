import 'tipo_viaje_tarifa.dart';

class EstimacionTarifa {
  final double precio;
  final double distanciaKm;
  final String tarifaId;
  final TipoViajeTarifa? tipoViaje;

  const EstimacionTarifa({
    required this.precio,
    required this.distanciaKm,
    required this.tarifaId,
    this.tipoViaje,
  });
}
