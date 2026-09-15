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
  final String? origenDireccion;
  final String? destinoDireccion;
  final DateTime fechaCreacion;

  const Viaje({
    required this.id,
    required this.pasajeroId,
    required this.conductorId,
    required this.estado,
    required this.tarifaEstimada,
    required this.origenLat,
    required this.origenLng,
    required this.destinoLat,
    required this.destinoLng,
    this.origenDireccion,
    this.destinoDireccion,
    required this.fechaCreacion,
  });

  Viaje copyWith({String? conductorId, String? estado}) {
    return Viaje(
      id: id,
      pasajeroId: pasajeroId,
      conductorId: conductorId ?? this.conductorId,
      estado: estado ?? this.estado,
      tarifaEstimada: tarifaEstimada,
      origenLat: origenLat,
      origenLng: origenLng,
      destinoLat: destinoLat,
      destinoLng: destinoLng,
      origenDireccion: origenDireccion,
      destinoDireccion: destinoDireccion,
      fechaCreacion: fechaCreacion,
    );
  }
}
