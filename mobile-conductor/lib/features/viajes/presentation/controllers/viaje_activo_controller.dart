import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/app_logger.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../balances/domain/usecases/obtener_pago_por_viaje_params.dart';
import '../../../balances/presentation/providers/balances_provider.dart';
import '../../domain/entities/estado_viaje_activo.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/mappers/mapeador_estado_viaje_activo.dart';
import '../../domain/usecases/obtener_direccion_params.dart';
import '../../domain/usecases/obtener_ruta_params.dart';
import '../providers/viaje_cancelado_id_provider.dart';
import '../providers/viajes_provider.dart';
import 'home_conductor_controller.dart';
import 'viaje_activo_state.dart';

final viajeActivoControllerProvider =
    NotifierProvider<ViajeActivoController, ViajeActivoState>(() {
      return ViajeActivoController();
    });

class ViajeActivoController extends Notifier<ViajeActivoState> {
  static const double _metrosMinimosParaNuevaRuta = 80;

  final Distance _calculadoraDistancia = const Distance();
  StreamSubscription? _suscripcionGps;
  LatLng? _ultimoOrigenRuta;

  @override
  ViajeActivoState build() {
    ref.onDispose(_cancelarGps);
    ref.listen<String?>(viajeCanceladoIdProvider, (anterior, siguiente) {
      if (siguiente == null ||
          state.viaje?.id != siguiente ||
          state.canceladoRemotamente) {
        return;
      }
      unawaited(_manejarCancelacionRemota(siguiente));
    });
    return const ViajeActivoState();
  }

  Future<void> inicializar(Viaje viaje) async {
    if (state.viaje?.id == viaje.id && _suscripcionGps != null) {
      return;
    }

    await _cancelarGps();
    final gateway = ref.read(viajeRealtimeGatewayProvider);
    await gateway.conectar();
    gateway.unirseAViaje(viaje.id);
    gateway.escucharViajeCancelado((canceladoId) {
      if (canceladoId == viaje.id) {
        ref.read(viajeCanceladoIdProvider.notifier).notificar(canceladoId);
      }
    });

    final ubicacionInicial = await ref
        .read(ubicacionGatewayProvider)
        .obtenerUbicacionActual();

    var latInicial = ubicacionInicial.fold((_) => 0.0, (c) => c.latitud);
    var lngInicial = ubicacionInicial.fold((_) => 0.0, (c) => c.longitud);
    var errorGps = ubicacionInicial.foldLogged(
      'ViajeActivoController.inicializar',
      (f) => f.mensaje,
      (_) => null,
    );

    // Reusa la ubicación del home si el fix puntual falló (emulador / timeout).
    if (latInicial == 0 && lngInicial == 0) {
      final delHome = ref.read(homeConductorControllerProvider).ubicacionActual;
      if (delHome != null) {
        latInicial = delHome.latitude;
        lngInicial = delHome.longitude;
        errorGps = null;
      }
    }

    state = ViajeActivoState(
      viaje: viaje,
      estado: MapeadorEstadoViajeActivo.desdeApi(viaje.estado),
      latitudActual: latInicial,
      longitudActual: lngInicial,
      etaInfo: AppStrings.viajeEsperandoInicio,
      errorMensaje: errorGps,
    );

    unawaited(_resolverDireccionesMarcadores(viaje));

    if (latInicial != 0 && lngInicial != 0) {
      unawaited(_actualizarRuta(forzar: true));
    }

    _iniciarSeguimientoGpsReal();
  }

  Future<void> _resolverDireccionesMarcadores(Viaje viaje) async {
    final viajeId = viaje.id;
    final obtenerDireccion = ref.read(obtenerDireccionUseCaseProvider);

    Future<String?> resolver(double lat, double lng) async {
      try {
        final resultado = await obtenerDireccion(
          ObtenerDireccionParams(latitud: lat, longitud: lng),
        ).timeout(const Duration(seconds: 6));
        return resultado.fold((_) => null, (texto) => texto);
      } catch (error, stack) {
        AppLogger.error(
          'ViajeActivoController._resolverDireccionesMarcadores',
          error,
          stack,
        );
        return null;
      }
    }

    final recogida = await resolver(viaje.origenLat, viaje.origenLng);
    if (state.viaje?.id != viajeId) {
      return;
    }
    state = state.copyWith(
      direccionRecogida: recogida ?? AppStrings.viajeDireccionNoDisponible,
    );

    await Future<void>.delayed(const Duration(milliseconds: 1100));
    if (state.viaje?.id != viajeId) {
      return;
    }

    final destino = await resolver(viaje.destinoLat, viaje.destinoLng);
    if (state.viaje?.id != viajeId) {
      return;
    }
    state = state.copyWith(
      direccionDestino: destino ?? AppStrings.viajeDireccionNoDisponible,
    );

    if (state.latitudActual == 0 && state.longitudActual == 0) {
      return;
    }

    await Future<void>.delayed(const Duration(milliseconds: 1100));
    if (state.viaje?.id != viajeId) {
      return;
    }

    final conductor = await resolver(
      state.latitudActual,
      state.longitudActual,
    );
    if (state.viaje?.id != viajeId) {
      return;
    }
    state = state.copyWith(
      direccionConductor: conductor ?? AppStrings.viajeDireccionNoDisponible,
    );
  }

  Future<void> _manejarCancelacionRemota(String viajeId) async {
    await _cancelarGps();
    ref.read(viajeRealtimeGatewayProvider).salirDeViaje(viajeId);
    state = state.copyWith(
      canceladoRemotamente: true,
      procesando: false,
      errorMensaje: AppStrings.viajeCanceladoPorPasajero,
    );
  }

  Future<void> avanzarEstado() async {
    final viaje = state.viaje;
    if (viaje == null || state.procesando) {
      return;
    }

    state = state.copyWith(procesando: true, errorMensaje: null);

    final gpsOk = await _enviarUbicacionAlServidor(
      state.latitudActual,
      state.longitudActual,
    );
    if (!gpsOk) {
      return;
    }

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
    unawaited(_cancelarGps());
    // Fuera del ciclo de vida del widget (dispose/build).
    Future(() {
      state = const ViajeActivoState();
    });
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

  LatLng obtenerUbicacionPasajero() {
    final viaje = state.viaje;
    if (viaje == null) {
      return const LatLng(0, 0);
    }
    return LatLng(viaje.origenLat, viaje.origenLng);
  }

  LatLng obtenerUbicacionDestino() {
    final viaje = state.viaje;
    if (viaje == null) {
      return const LatLng(0, 0);
    }
    return LatLng(viaje.destinoLat, viaje.destinoLng);
  }

  LatLng obtenerUbicacionObjetivo() {
    return switch (state.estado) {
      EstadoViajeActivo.enViaje => obtenerUbicacionDestino(),
      EstadoViajeActivo.completado => obtenerUbicacionDestino(),
      _ => obtenerUbicacionPasajero(),
    };
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
        unawaited(_actualizarRuta(forzar: true));
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
          final posicion = LatLng(coordenada.latitud, coordenada.longitud);
          final distanciaMetros = _calculadoraDistancia.as(
            LengthUnit.Meter,
            posicion,
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

          if (state.direccionConductor == null) {
            unawaited(_resolverDireccionConductor(
              coordenada.latitud,
              coordenada.longitud,
            ));
          }

          ref
              .read(viajeRealtimeGatewayProvider)
              .actualizarUbicacion(
                viajeId: viaje.id,
                latitud: coordenada.latitud,
                longitud: coordenada.longitud,
              );

          unawaited(_actualizarRuta());
        });
  }

  Future<void> _resolverDireccionConductor(
    double latitud,
    double longitud,
  ) async {
    final viajeId = state.viaje?.id;
    if (viajeId == null) {
      return;
    }
    try {
      final resultado = await ref
          .read(obtenerDireccionUseCaseProvider)(
            ObtenerDireccionParams(latitud: latitud, longitud: longitud),
          )
          .timeout(const Duration(seconds: 6));
      if (state.viaje?.id != viajeId || state.direccionConductor != null) {
        return;
      }
      state = state.copyWith(
        direccionConductor: resultado.fold(
          (_) => AppStrings.viajeDireccionNoDisponible,
          (texto) => texto,
        ),
      );
    } catch (_) {
      if (state.viaje?.id != viajeId || state.direccionConductor != null) {
        return;
      }
      state = state.copyWith(
        direccionConductor: AppStrings.viajeDireccionNoDisponible,
      );
    }
  }

  Future<void> _actualizarRuta({bool forzar = false}) async {
    final viaje = state.viaje;
    if (viaje == null) {
      return;
    }
    if (state.latitudActual == 0 && state.longitudActual == 0) {
      return;
    }

    final origen = LatLng(state.latitudActual, state.longitudActual);
    final destino = obtenerUbicacionObjetivo();

    if (!forzar && _ultimoOrigenRuta != null) {
      final desplazamiento = _calculadoraDistancia.as(
        LengthUnit.Meter,
        _ultimoOrigenRuta!,
        origen,
      );
      if (desplazamiento < _metrosMinimosParaNuevaRuta) {
        return;
      }
    }

    _ultimoOrigenRuta = origen;

    final resultado = await ref.read(obtenerRutaUseCaseProvider)(
      ObtenerRutaParams(
        origenLat: origen.latitude,
        origenLng: origen.longitude,
        destinoLat: destino.latitude,
        destinoLng: destino.longitude,
      ),
    );

    resultado.fold(
      (_) {},
      (ruta) {
        state = state.copyWith(
          puntosRuta: ruta.puntos
              .map((punto) => LatLng(punto.latitud, punto.longitud))
              .toList(),
          etaInfo: ruta.distanciaKm == 0
              ? state.etaInfo
              : AppStrings.formatoEta(ruta.distanciaKm, ruta.duracionMinutos),
        );
      },
    );
  }

  Future<bool> _enviarUbicacionAlServidor(
    double latitud,
    double longitud,
  ) async {
    final viaje = state.viaje;
    final resultado = await ref
        .read(disponibilidadRepositoryProvider)
        .actualizarUbicacion(latitud: latitud, longitud: longitud);

    return resultado.foldLogged(
      'ViajeActivoController._enviarUbicacionAlServidor',
      (failure) {
        state = state.copyWith(
          procesando: false,
          errorMensaje: failure.mensaje,
        );
        return false;
      },
      (_) {
        if (viaje != null) {
          ref
              .read(viajeRealtimeGatewayProvider)
              .actualizarUbicacion(
                viajeId: viaje.id,
                latitud: latitud,
                longitud: longitud,
              );
        }
        return true;
      },
    );
  }

  Future<void> _cancelarGps() async {
    await _suscripcionGps?.cancel();
    _suscripcionGps = null;
    _ultimoOrigenRuta = null;
  }
}
