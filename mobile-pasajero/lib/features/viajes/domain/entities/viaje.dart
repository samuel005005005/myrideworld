class Viaje {
  final String id;
  final String pasajeroId;
  final String? conductorId;
  final String estado;
  final double tarifaEstimada;
  final double origenLat;
  final double origenLng;
  final double destinoLat;
  final double destinoLng;
  final DateTime fechaCreacion;

  const Viaje({
    required this.id,
    required this.pasajeroId,
    this.conductorId,
    required this.estado,
    required this.tarifaEstimada,
    required this.origenLat,
    required this.origenLng,
    required this.destinoLat,
    required this.destinoLng,
    required this.fechaCreacion,
  });
}
