import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/estado_viaje_activo.dart';
import '../../domain/entities/viaje.dart';
import '../providers/viajes_provider.dart';
import 'viaje_activo_state.dart';

final viajeActivoControllerProvider =
    NotifierProvider<ViajeActivoController, ViajeActivoState>(() {
      return ViajeActivoController();
    });

class ViajeActivoController extends Notifier<ViajeActivoState> {
  final Distance _calculadoraDistancia = const Distance();
  Timer? _temporizadorGps;

  @override
  ViajeActivoState build() {
    ref.onDispose(_cancelarTemporizador);
    return const ViajeActivoState();
  }

  void inicializar(Viaje viaje) {
    if (state.viaje?.id == viaje.id && _temporizadorGps != null) {
      return;
    }

    _cancelarTemporizador();
    ref.read(viajeRealtimeGatewayProvider).unirseAViaje(viaje.id);

    state = ViajeActivoState(
      viaje: viaje,
      estado: EstadoViajeActivo.enCaminoAlPasajero,
      latitudActual: viaje.origenLat - 0.005,
      longitudActual: viaje.origenLng - 0.005,
      etaInfo: AppStrings.viajeEsperandoInicio,
    );

    _iniciarSimulacionGps();
  }

  Future<void> avanzarEstado() async {
    final viaje = state.viaje;
    if (viaje == null || state.procesando) {
      return;
    }

    state = state.copyWith(procesando: true, errorMensaje: null);

    switch (state.estado) {
      case EstadoViajeActivo.enCaminoAlPasajero:
        await _ejecutarLlegada(viaje);
        return;
      case EstadoViajeActivo.esperandoPasajero:
        await _ejecutarInicio(viaje);
        return;
      case EstadoViajeActivo.enViaje:
        await _ejecutarCompletado(viaje);
        return;
      case EstadoViajeActivo.completado:
        return;
    }
  }

  void limpiarError() {
    state = state.copyWith(errorMensaje: null);
  }

  void limpiar() {
    _cancelarTemporizador();
    state = const ViajeActivoState();
  }

  String obtenerTituloEstado() {
    return switch (state.estado) {
      EstadoViajeActivo.enCaminoAlPasajero => AppStrings.viajeEstadoEnCamino,
      EstadoViajeActivo.esperandoPasajero => AppStrings.viajeEstadoEsperando,
      EstadoViajeActivo.enViaje => AppStrings.viajeEstadoEnCurso,
      EstadoViajeActivo.completado => AppStrings.viajeEstadoEnCurso,
    };
  }

  String obtenerTextoBoton() {
    return switch (state.estado) {
      EstadoViajeActivo.enCaminoAlPasajero => AppStrings.viajeBotonLlegada,
      EstadoViajeActivo.esperandoPasajero => AppStrings.viajeBotonIniciar,
      EstadoViajeActivo.enViaje => AppStrings.viajeBotonCompletar,
      EstadoViajeActivo.completado => AppStrings.viajeBotonCompletar,
    };
  }

  LatLng obtenerUbicacionActual() {
    return LatLng(state.latitudActual, state.longitudActual);
  }

  LatLng obtenerUbicacionObjetivo() {
    final viaje = state.viaje;
    if (viaje == null) {
      return const LatLng(0, 0);
    }

    return switch (state.estado) {
      EstadoViajeActivo.enViaje => LatLng(viaje.destinoLat, viaje.destinoLng),
      EstadoViajeActivo.completado => LatLng(
        viaje.destinoLat,
        viaje.destinoLng,
      ),
      _ => LatLng(viaje.origenLat, viaje.origenLng),
    };
  }

  bool mostrarOrigen() {
    return state.estado != EstadoViajeActivo.enViaje &&
        state.estado != EstadoViajeActivo.completado;
  }

  bool mostrarDestino() {
    return state.estado == EstadoViajeActivo.enViaje ||
        state.estado == EstadoViajeActivo.completado;
  }

  Future<void> _ejecutarLlegada(Viaje viaje) async {
    final resultado = await ref.read(marcarLlegadaProvider)(viaje.id);
    resultado.fold(
      (failure) {
        state = state.copyWith(
          procesando: false,
          errorMensaje: failure.mensaje,
        );
      },
      (viajeActualizado) {
        state = state.copyWith(
          viaje: viajeActualizado,
          estado: EstadoViajeActivo.esperandoPasajero,
          procesando: false,
          etaInfo: '',
          errorMensaje: null,
        );
      },
    );
  }

  Future<void> _ejecutarInicio(Viaje viaje) async {
    final resultado = await ref.read(iniciarViajeProvider)(viaje.id);
    resultado.fold(
      (failure) {
        state = state.copyWith(
          procesando: false,
          errorMensaje: failure.mensaje,
        );
      },
      (viajeActualizado) {
        state = state.copyWith(
          viaje: viajeActualizado,
          estado: EstadoViajeActivo.enViaje,
          procesando: false,
          errorMensaje: null,
        );
      },
    );
  }

  Future<void> _ejecutarCompletado(Viaje viaje) async {
    final resultado = await ref.read(completarViajeProvider)(viaje.id);
    resultado.fold(
      (failure) {
        state = state.copyWith(
          procesando: false,
          errorMensaje: failure.mensaje,
        );
      },
      (viajeActualizado) {
        _cancelarTemporizador();
        state = state.copyWith(
          viaje: viajeActualizado,
          estado: EstadoViajeActivo.completado,
          procesando: false,
          finalizado: true,
          errorMensaje: null,
        );
      },
    );
  }

  void _iniciarSimulacionGps() {
    _temporizadorGps = Timer.periodic(const Duration(seconds: 2), (_) {
      final viaje = state.viaje;
      if (viaje == null) {
        return;
      }

      final objetivo = obtenerUbicacionObjetivo();
      final nuevaLatitud =
          state.latitudActual + (objetivo.latitude - state.latitudActual) * 0.1;
      final nuevaLongitud =
          state.longitudActual +
          (objetivo.longitude - state.longitudActual) * 0.1;

      final distanciaMetros = _calculadoraDistancia.as(
        LengthUnit.Meter,
        LatLng(nuevaLatitud, nuevaLongitud),
        objetivo,
      );

      final kilometros = distanciaMetros / 1000;
      final minutos = (distanciaMetros / 500).ceil();

      state = state.copyWith(
        latitudActual: nuevaLatitud,
        longitudActual: nuevaLongitud,
        etaInfo: distanciaMetros < 50
            ? AppStrings.viajeMuyCerca
            : AppStrings.formatoEta(kilometros, minutos),
      );

      ref
          .read(viajeRealtimeGatewayProvider)
          .actualizarUbicacion(
            viajeId: viaje.id,
            latitud: nuevaLatitud,
            longitud: nuevaLongitud,
          );
    });
  }

  void _cancelarTemporizador() {
    _temporizadorGps?.cancel();
    _temporizadorGps = null;
  }
}
