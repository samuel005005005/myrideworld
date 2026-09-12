import 'package:latlong2/latlong.dart';

import '../../domain/entities/conductor_asignado.dart';
import '../../domain/entities/recibo_viaje.dart';

class ViajeActivoState {
  static const Object _sinCambio = Object();

  final String? viajeId;
  final LatLng ubicacionConductor;
  final String estadoViaje;
  final String? infoEta;
  final ReciboViaje? reciboPendiente;
  final ConductorAsignado? conductor;
  final bool cancelando;
  final String? errorCancelacion;
  final bool cancelado;

  const ViajeActivoState({
    this.viajeId,
    required this.ubicacionConductor,
    required this.estadoViaje,
    this.infoEta,
    this.reciboPendiente,
    this.conductor,
    this.cancelando = false,
    this.errorCancelacion,
    this.cancelado = false,
  });

  bool get puedeCancelar =>
      viajeId != null &&
      viajeId!.isNotEmpty &&
      !cancelando &&
      !cancelado &&
      reciboPendiente == null;

  ViajeActivoState copyWith({
    Object? viajeId = _sinCambio,
    LatLng? ubicacionConductor,
    String? estadoViaje,
    Object? infoEta = _sinCambio,
    Object? reciboPendiente = _sinCambio,
    Object? conductor = _sinCambio,
    bool? cancelando,
    Object? errorCancelacion = _sinCambio,
    bool? cancelado,
  }) {
    return ViajeActivoState(
      viajeId: identical(viajeId, _sinCambio)
          ? this.viajeId
          : viajeId as String?,
      ubicacionConductor: ubicacionConductor ?? this.ubicacionConductor,
      estadoViaje: estadoViaje ?? this.estadoViaje,
      infoEta: identical(infoEta, _sinCambio)
          ? this.infoEta
          : infoEta as String?,
      reciboPendiente: identical(reciboPendiente, _sinCambio)
          ? this.reciboPendiente
          : reciboPendiente as ReciboViaje?,
      conductor: identical(conductor, _sinCambio)
          ? this.conductor
          : conductor as ConductorAsignado?,
      cancelando: cancelando ?? this.cancelando,
      errorCancelacion: identical(errorCancelacion, _sinCambio)
          ? this.errorCancelacion
          : errorCancelacion as String?,
      cancelado: cancelado ?? this.cancelado,
    );
  }
}
