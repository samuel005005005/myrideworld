import 'package:latlong2/latlong.dart';

import '../../domain/entities/viaje.dart';

class HomeConductorState {
  static const Object _sinCambio = Object();

  final bool inicializando;
  final bool enLinea;
  final bool cambiandoDisponibilidad;
  final bool aceptandoViaje;
  final bool rechazandoViaje;
  final Viaje? viajePendiente;
  final Viaje? viajeActivoParaRestaurar;
  final LatLng? ubicacionActual;
  final String? errorMensaje;

  const HomeConductorState({
    this.inicializando = false,
    this.enLinea = false,
    this.cambiandoDisponibilidad = false,
    this.aceptandoViaje = false,
    this.rechazandoViaje = false,
    this.viajePendiente,
    this.viajeActivoParaRestaurar,
    this.ubicacionActual,
    this.errorMensaje,
  });

  HomeConductorState copyWith({
    bool? inicializando,
    bool? enLinea,
    bool? cambiandoDisponibilidad,
    bool? aceptandoViaje,
    bool? rechazandoViaje,
    Object? viajePendiente = _sinCambio,
    Object? viajeActivoParaRestaurar = _sinCambio,
    Object? ubicacionActual = _sinCambio,
    Object? errorMensaje = _sinCambio,
  }) {
    return HomeConductorState(
      inicializando: inicializando ?? this.inicializando,
      enLinea: enLinea ?? this.enLinea,
      cambiandoDisponibilidad:
          cambiandoDisponibilidad ?? this.cambiandoDisponibilidad,
      aceptandoViaje: aceptandoViaje ?? this.aceptandoViaje,
      rechazandoViaje: rechazandoViaje ?? this.rechazandoViaje,
      viajePendiente: identical(viajePendiente, _sinCambio)
          ? this.viajePendiente
          : viajePendiente as Viaje?,
      viajeActivoParaRestaurar: identical(viajeActivoParaRestaurar, _sinCambio)
          ? this.viajeActivoParaRestaurar
          : viajeActivoParaRestaurar as Viaje?,
      ubicacionActual: identical(ubicacionActual, _sinCambio)
          ? this.ubicacionActual
          : ubicacionActual as LatLng?,
      errorMensaje: identical(errorMensaje, _sinCambio)
          ? this.errorMensaje
          : errorMensaje as String?,
    );
  }
}
