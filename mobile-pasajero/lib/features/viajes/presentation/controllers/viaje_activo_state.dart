import 'package:latlong2/latlong.dart';

import '../../domain/entities/recibo_viaje.dart';

class ViajeActivoState {
  static const Object _sinCambio = Object();

  final LatLng ubicacionConductor;
  final String estadoViaje;
  final String? infoEta;
  final ReciboViaje? reciboPendiente;

  const ViajeActivoState({
    required this.ubicacionConductor,
    required this.estadoViaje,
    this.infoEta,
    this.reciboPendiente,
  });

  ViajeActivoState copyWith({
    LatLng? ubicacionConductor,
    String? estadoViaje,
    Object? infoEta = _sinCambio,
    Object? reciboPendiente = _sinCambio,
  }) {
    return ViajeActivoState(
      ubicacionConductor: ubicacionConductor ?? this.ubicacionConductor,
      estadoViaje: estadoViaje ?? this.estadoViaje,
      infoEta: identical(infoEta, _sinCambio)
          ? this.infoEta
          : infoEta as String?,
      reciboPendiente: identical(reciboPendiente, _sinCambio)
          ? this.reciboPendiente
          : reciboPendiente as ReciboViaje?,
    );
  }
}
