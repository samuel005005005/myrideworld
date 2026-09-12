import '../../domain/entities/conductor_asignado.dart';

class BusquedaConductorState {
  static const Object _sinCambio = Object();

  final bool cancelando;
  final bool listoParaNavegar;
  final ConductorAsignado? conductorAsignado;
  final String? error;

  const BusquedaConductorState({
    this.cancelando = false,
    this.listoParaNavegar = false,
    this.conductorAsignado,
    this.error,
  });

  BusquedaConductorState copyWith({
    bool? cancelando,
    bool? listoParaNavegar,
    Object? conductorAsignado = _sinCambio,
    Object? error = _sinCambio,
  }) {
    return BusquedaConductorState(
      cancelando: cancelando ?? this.cancelando,
      listoParaNavegar: listoParaNavegar ?? this.listoParaNavegar,
      conductorAsignado: identical(conductorAsignado, _sinCambio)
          ? this.conductorAsignado
          : conductorAsignado as ConductorAsignado?,
      error: identical(error, _sinCambio) ? this.error : error as String?,
    );
  }
}
