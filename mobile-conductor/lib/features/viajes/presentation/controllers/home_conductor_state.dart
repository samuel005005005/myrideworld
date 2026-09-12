import '../../domain/entities/viaje.dart';

class HomeConductorState {
  static const Object _sinCambio = Object();

  final bool inicializando;
  final bool enLinea;
  final bool aceptandoViaje;
  final Viaje? viajePendiente;
  final String? errorMensaje;

  const HomeConductorState({
    this.inicializando = false,
    this.enLinea = false,
    this.aceptandoViaje = false,
    this.viajePendiente,
    this.errorMensaje,
  });

  HomeConductorState copyWith({
    bool? inicializando,
    bool? enLinea,
    bool? aceptandoViaje,
    Object? viajePendiente = _sinCambio,
    Object? errorMensaje = _sinCambio,
  }) {
    return HomeConductorState(
      inicializando: inicializando ?? this.inicializando,
      enLinea: enLinea ?? this.enLinea,
      aceptandoViaje: aceptandoViaje ?? this.aceptandoViaje,
      viajePendiente: identical(viajePendiente, _sinCambio)
          ? this.viajePendiente
          : viajePendiente as Viaje?,
      errorMensaje: identical(errorMensaje, _sinCambio)
          ? this.errorMensaje
          : errorMensaje as String?,
    );
  }
}
