import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../balances/domain/usecases/obtener_pago_por_viaje_params.dart';
import '../../../balances/presentation/providers/balances_provider.dart';
import '../../domain/entities/estado_viaje_activo.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/mappers/mapeador_estado_viaje_activo.dart';
import '../providers/viajes_provider.dart';
import 'viaje_activo_state.dart';

final viajeActivoControllerProvider =
    NotifierProvider<ViajeActivoController, ViajeActivoState>(() {
      return ViajeActivoController();
    });

class ViajeActivoController extends Notifier<ViajeActivoState> {
  final Distance _calculadoraDistancia = const Distance();
  StreamSubscription? _suscripcionGps;

  @override
  ViajeActivoState build() {
    ref.onDispose(_cancelarGps);
    return const ViajeActivoState();
  }

  Future<void> inicializar(Viaje viaje) async {
    if (state.viaje?.id == viaje.id && _suscripcionGps != null) {
      return;
    }

    await _cancelarGps();
    ref.read(viajeRealtimeGatewayProvider).unirseAViaje(viaje.id);

    final ubicacionInicial = await ref
        .read(ubicacionGatewayProvider)
        .obtenerUbicacionActual();

    final latInicial = ubicacionInicial.fold(
      (_) => viaje.origenLat,
      (c) => c.latitud,
    );
    final lngInicial = ubicacionInicial.fold(
      (_) => viaje.origenLng,
      (c) => c.longitud,
    );

    final errorGps = ubicacionInicial.foldLogged(
      'ViajeActivoController.inicializar',
      (f) => f.mensaje,
      (_) => null,
    );

    state = ViajeActivoState(
      viaje: viaje,
      estado: MapeadorEstadoViajeActivo.desdeApi(viaje.estado),
      latitudActual: latInicial,
      longitudActual: lngInicial,
      etaInfo: AppStrings.viajeEsperandoInicio,
      errorMensaje: errorGps,
    );

    _iniciarSeguimientoGpsReal();
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
    _cancelarGps();
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
    resultado.foldLogged(
      'ViajeActivoController._ejecutarLlegada',
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
    resultado.foldLogged(
      'ViajeActivoController._ejecutarInicio',
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
    await resultado.foldLogged(
      'ViajeActivoController._ejecutarCompletado',
      (failure) async {
        state = state.copyWith(
          procesando: false,
          errorMensaje: failure.mensaje,
        );
      },
      (viajeActualizado) async {
        _cancelarGps();
        final pagoResultado = await ref.read(obtenerPagoPorViajeProvider)(
          ObtenerPagoPorViajeParams(viaje.id),
        );

        pagoResultado.foldLogged(
          'ViajeActivoController._ejecutarCompletado',
          (failure) {
            state = state.copyWith(
              viaje: viajeActualizado,
              estado: EstadoViajeActivo.completado,
              procesando: false,
              finalizado: true,
              errorMensaje: failure.mensaje,
            );
          },
          (pago) {
            state = state.copyWith(
              viaje: viajeActualizado,
              estado: EstadoViajeActivo.completado,
              procesando: false,
              finalizado: true,
              recibo: pago,
              errorMensaje: null,
            );
          },
        );
      },
    );
  }

  void _iniciarSeguimientoGpsReal() {
    _suscripcionGps?.cancel();
    _suscripcionGps = ref
        .read(ubicacionGatewayProvider)
        .observarUbicacion()
        .listen((coordenada) {
          final viaje = state.viaje;
          if (viaje == null) {
            return;
          }

          final objetivo = obtenerUbicacionObjetivo();
          final distanciaMetros = _calculadoraDistancia.as(
            LengthUnit.Meter,
            LatLng(coordenada.latitud, coordenada.longitud),
            objetivo,
          );

          final kilometros = distanciaMetros / 1000;
          final minutos = (distanciaMetros / 500).ceil();

          state = state.copyWith(
            latitudActual: coordenada.latitud,
            longitudActual: coordenada.longitud,
            etaInfo: distanciaMetros < 50
                ? AppStrings.viajeMuyCerca
                : AppStrings.formatoEta(kilometros, minutos),
            errorMensaje: null,
          );

          ref
              .read(viajeRealtimeGatewayProvider)
              .actualizarUbicacion(
                viajeId: viaje.id,
                latitud: coordenada.latitud,
                longitud: coordenada.longitud,
              );
        });
  }

  Future<void> _cancelarGps() async {
    await _suscripcionGps?.cancel();
    _suscripcionGps = null;
  }
}
