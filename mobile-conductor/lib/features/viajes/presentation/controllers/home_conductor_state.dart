import 'package:latlong2/latlong.dart';

import '../../domain/entities/viaje.dart';
import '../models/oferta_en_cola.dart';

class HomeConductorState {
  static const Object _sinCambio = Object();

  final bool inicializando;
  final bool enLinea;
  final bool cambiandoDisponibilidad;
  final bool aceptandoViaje;
  final bool rechazandoViaje;
  final List<OfertaEnCola> ofertas;
  final String? aceptandoViajeId;
  final String? rechazandoViajeId;
  final Viaje? viajeActivoParaRestaurar;
  final LatLng? ubicacionActual;
  final String? errorMensaje;

  const HomeConductorState({
    this.inicializando = false,
    this.enLinea = false,
    this.cambiandoDisponibilidad = false,
    this.aceptandoViaje = false,
    this.rechazandoViaje = false,
    this.ofertas = const <OfertaEnCola>[],
    this.aceptandoViajeId,
    this.rechazandoViajeId,
    this.viajeActivoParaRestaurar,
    this.ubicacionActual,
    this.errorMensaje,
  });

  bool get tieneOfertas => ofertas.isNotEmpty;

  HomeConductorState copyWith({
    bool? inicializando,
    bool? enLinea,
    bool? cambiandoDisponibilidad,
    bool? aceptandoViaje,
    bool? rechazandoViaje,
    List<OfertaEnCola>? ofertas,
    Object? aceptandoViajeId = _sinCambio,
    Object? rechazandoViajeId = _sinCambio,
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
      ofertas: ofertas ?? this.ofertas,
      aceptandoViajeId: identical(aceptandoViajeId, _sinCambio)
          ? this.aceptandoViajeId
          : aceptandoViajeId as String?,
      rechazandoViajeId: identical(rechazandoViajeId, _sinCambio)
          ? this.rechazandoViajeId
          : rechazandoViajeId as String?,
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
