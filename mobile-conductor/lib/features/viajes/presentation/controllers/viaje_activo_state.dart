import 'package:latlong2/latlong.dart';

import '../../domain/entities/estado_viaje_activo.dart';
import '../../domain/entities/viaje.dart';
import '../../../balances/domain/entities/pago_balance.dart';

class ViajeActivoState {
  static const Object _sinCambio = Object();

  final Viaje? viaje;
  final EstadoViajeActivo estado;
  final double latitudActual;
  final double longitudActual;
  final String etaInfo;
  final bool procesando;
  final bool finalizado;
  final PagoBalance? recibo;
  final String? errorMensaje;
  final List<LatLng> puntosRuta;
  final String? direccionRecogida;
  final String? direccionDestino;
  final String? direccionConductor;
  final bool canceladoRemotamente;

  const ViajeActivoState({
    this.viaje,
    this.estado = EstadoViajeActivo.enCaminoAlPasajero,
    this.latitudActual = 0,
    this.longitudActual = 0,
    this.etaInfo = '',
    this.procesando = false,
    this.finalizado = false,
    this.recibo,
    this.errorMensaje,
    this.puntosRuta = const <LatLng>[],
    this.direccionRecogida,
    this.direccionDestino,
    this.direccionConductor,
    this.canceladoRemotamente = false,
  });

  ViajeActivoState copyWith({
    Object? viaje = _sinCambio,
    EstadoViajeActivo? estado,
    double? latitudActual,
    double? longitudActual,
    String? etaInfo,
    bool? procesando,
    bool? finalizado,
    Object? recibo = _sinCambio,
    Object? errorMensaje = _sinCambio,
    List<LatLng>? puntosRuta,
    Object? direccionRecogida = _sinCambio,
    Object? direccionDestino = _sinCambio,
    Object? direccionConductor = _sinCambio,
    bool? canceladoRemotamente,
  }) {
    return ViajeActivoState(
      viaje: identical(viaje, _sinCambio) ? this.viaje : viaje as Viaje?,
      estado: estado ?? this.estado,
      latitudActual: latitudActual ?? this.latitudActual,
      longitudActual: longitudActual ?? this.longitudActual,
      etaInfo: etaInfo ?? this.etaInfo,
      procesando: procesando ?? this.procesando,
      finalizado: finalizado ?? this.finalizado,
      recibo: identical(recibo, _sinCambio) ? this.recibo : recibo as PagoBalance?,
      errorMensaje: identical(errorMensaje, _sinCambio)
          ? this.errorMensaje
          : errorMensaje as String?,
      puntosRuta: puntosRuta ?? this.puntosRuta,
      direccionRecogida: identical(direccionRecogida, _sinCambio)
          ? this.direccionRecogida
          : direccionRecogida as String?,
      direccionDestino: identical(direccionDestino, _sinCambio)
          ? this.direccionDestino
          : direccionDestino as String?,
      direccionConductor: identical(direccionConductor, _sinCambio)
          ? this.direccionConductor
          : direccionConductor as String?,
      canceladoRemotamente:
          canceladoRemotamente ?? this.canceladoRemotamente,
    );
  }
}
