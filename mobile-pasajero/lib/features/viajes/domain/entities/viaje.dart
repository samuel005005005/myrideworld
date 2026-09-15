import 'conductor_asignado.dart';

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
  final ConductorAsignado? conductor;

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
    this.origenDireccion,
    this.destinoDireccion,
    required this.fechaCreacion,
    this.conductor,
  });
}
