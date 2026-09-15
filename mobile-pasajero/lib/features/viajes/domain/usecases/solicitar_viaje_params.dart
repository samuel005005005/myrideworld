class SolicitarViajeParams {
  final double origenLat;
  final double origenLng;
  final double destinoLat;
  final double destinoLng;
  final String origenDireccion;
  final String destinoDireccion;
  final String idempotencyKey;

  const SolicitarViajeParams({
    required this.origenLat,
    required this.origenLng,
    required this.destinoLat,
    required this.destinoLng,
    required this.origenDireccion,
    required this.destinoDireccion,
    required this.idempotencyKey,
  });
}
