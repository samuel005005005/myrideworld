import '../../domain/entities/estado_viaje_activo.dart';
import '../../domain/entities/viaje.dart';

class ViajeActivoState {
  static const Object _sinCambio = Object();

  final Viaje? viaje;
  final EstadoViajeActivo estado;
  final double latitudActual;
  final double longitudActual;
  final String etaInfo;
  final bool procesando;
  final bool finalizado;
  final String? errorMensaje;

  const ViajeActivoState({
    this.viaje,
    this.estado = EstadoViajeActivo.enCaminoAlPasajero,
    this.latitudActual = 0,
    this.longitudActual = 0,
    this.etaInfo = '',
    this.procesando = false,
    this.finalizado = false,
    this.errorMensaje,
  });

  ViajeActivoState copyWith({
    Object? viaje = _sinCambio,
    EstadoViajeActivo? estado,
    double? latitudActual,
    double? longitudActual,
    String? etaInfo,
    bool? procesando,
    bool? finalizado,
    Object? errorMensaje = _sinCambio,
  }) {
    return ViajeActivoState(
      viaje: identical(viaje, _sinCambio) ? this.viaje : viaje as Viaje?,
      estado: estado ?? this.estado,
      latitudActual: latitudActual ?? this.latitudActual,
      longitudActual: longitudActual ?? this.longitudActual,
      etaInfo: etaInfo ?? this.etaInfo,
      procesando: procesando ?? this.procesando,
      finalizado: finalizado ?? this.finalizado,
      errorMensaje: identical(errorMensaje, _sinCambio)
          ? this.errorMensaje
          : errorMensaje as String?,
    );
  }
}
