import 'dart:async';
import 'dart:math' as math;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:uuid/uuid.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/constants/ubicaciones_turisticas.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/conductor_cercano.dart';
import '../../domain/usecases/estimar_tarifa_params.dart';
import '../../domain/usecases/obtener_conductores_cercanos_params.dart';
import '../../domain/usecases/obtener_direccion_params.dart';
import '../../domain/usecases/obtener_ruta_usecase.dart';
import '../../domain/usecases/solicitar_viaje_params.dart';
import '../../domain/usecases/solicitar_viaje_usecase.dart';
import '../providers/viajes_provider.dart';
import 'home_state.dart';
import 'home_state_status.dart';

final homeControllerProvider = NotifierProvider<HomeController, HomeState>(() {
  return HomeController();
});

class HomeController extends Notifier<HomeState> {
  static const _intervaloRefrescoFlota = Duration(seconds: 12);

  final _uuid = const Uuid();
  bool _yaInicializado = false;
  bool _flotaActiva = false;
  Timer? _timerFlota;

  @override
  HomeState build() {
    ref.onDispose(() {
      _timerFlota?.cancel();
      if (_flotaActiva) {
        ref.read(viajeRealtimeGatewayProvider).dejarDeObservarFlota();
      }
    });
    return const HomeState(
      status: HomeStateStatus.initial,
      currentLocation: null,
      destinationLocation: null,
      pickupLabel: AppStrings.homeLoadingLocation,
      dropoffLabel: AppStrings.homeWhereTo,
      routePoints: <LatLng>[],
      routeDistanceKm: 0,
      routeDurationMin: 0,
      tarifaEstimada: null,
    );
  }

  Future<void> inicializar() async {
    if (_yaInicializado) {
      return;
    }

    _yaInicializado = true;
    state = state.copyWith(status: HomeStateStatus.loading, errorMessage: null);

    final ubicacionResultado = await ref.read(ubicacionGatewayProvider)
        .obtenerUbicacionActual();

    final ok = ubicacionResultado.foldLogged(
      'HomeController.inicializar',
      (failure) {
        _yaInicializado = false;
        state = state.copyWith(
          status: HomeStateStatus.error,
          errorMessage: failure.mensaje,
        );
        return false;
      },
      (coordenada) {
        state = state.copyWith(
          currentLocation: LatLng(coordenada.latitud, coordenada.longitud),
          pickupLabel: AppStrings.homeMiUbicacion,
          errorMessage: null,
        );
        return true;
      },
    );

    if (!ok) {
      return;
    }

    unawaited(_iniciarFlotaEnMapa());

    final activoResultado = await ref.read(obtenerViajeActivoUseCaseProvider)(
      NoParams(),
    );
    activoResultado.fold(
      (_) {},
      (viajeActivo) {
        if (viajeActivo != null) {
          _detenerFlotaEnMapa();
          state = state.copyWith(viajeParaRestaurar: viajeActivo);
        }
      },
    );

    if (_tieneDestinoSeleccionado(state.dropoffLabel)) {
      await _actualizarRuta(
        pickupLabel: state.pickupLabel,
        dropoffLabel: state.dropoffLabel,
        origenFijo: state.currentLocation,
      );
    } else {
      state = state.copyWith(status: HomeStateStatus.selectingDestination);
    }
  }

  Future<void> _iniciarFlotaEnMapa() async {
    final ubicacion = state.currentLocation;
    if (ubicacion == null) {
      return;
    }

    final gateway = ref.read(viajeRealtimeGatewayProvider);
    await gateway.conectar();
    gateway.escucharUbicacionConductorFlota(_actualizarConductorFlota);
    gateway.escucharConductorFueraDeFlota(_quitarConductorFlota);
    _flotaActiva = true;

    await _refrescarFlotaEnMapa();
    _timerFlota?.cancel();
    _timerFlota = Timer.periodic(_intervaloRefrescoFlota, (_) {
      unawaited(_refrescarFlotaEnMapa());
    });
  }

  void _detenerFlotaEnMapa() {
    _timerFlota?.cancel();
    _timerFlota = null;
    if (_flotaActiva) {
      ref.read(viajeRealtimeGatewayProvider).dejarDeObservarFlota();
      _flotaActiva = false;
    }
    if (state.conductoresCercanos.isNotEmpty) {
      state = state.copyWith(conductoresCercanos: const []);
    }
  }

  Future<void> _refrescarFlotaEnMapa() async {
    final ubicacion = state.currentLocation;
    if (ubicacion == null || !_flotaActiva) {
      return;
    }

    final gateway = ref.read(viajeRealtimeGatewayProvider);
    gateway.observarFlota(
      latitud: ubicacion.latitude,
      longitud: ubicacion.longitude,
    );

    final snapshot = await ref.read(obtenerConductoresCercanosUseCaseProvider)(
      ObtenerConductoresCercanosParams(
        latitud: ubicacion.latitude,
        longitud: ubicacion.longitude,
      ),
    );
    snapshot.foldLogged(
      'HomeController.refrescarFlota',
      (_) {},
      (lista) {
        if (!_flotaActiva) {
          return;
        }
        final previos = <String, ConductorCercano>{
          for (final c in state.conductoresCercanos) c.id: c,
        };
        state = state.copyWith(
          conductoresCercanos: [
            for (final cercano in lista)
              cercano.copyWith(rumboGrados: previos[cercano.id]?.rumboGrados),
          ],
        );
      },
    );
  }

  void _actualizarConductorFlota(ConductorCercano actualizado) {
    if (!_flotaActiva) {
      return;
    }
    final actuales = List<ConductorCercano>.from(state.conductoresCercanos);
    final indice = actuales.indexWhere((c) => c.id == actualizado.id);
    double? rumbo = actualizado.rumboGrados;
    if (indice >= 0) {
      final previo = actuales[indice];
      rumbo = _calcularRumbo(
        previo.latitud,
        previo.longitud,
        actualizado.latitud,
        actualizado.longitud,
      );
      actuales[indice] = actualizado.copyWith(
        rumboGrados: rumbo ?? previo.rumboGrados,
      );
    } else {
      actuales.add(actualizado);
    }
    state = state.copyWith(conductoresCercanos: actuales);
  }

  void _quitarConductorFlota(String conductorId) {
    if (!_flotaActiva) {
      return;
    }
    state = state.copyWith(
      conductoresCercanos: state.conductoresCercanos
          .where((c) => c.id != conductorId)
          .toList(),
    );
  }

  double? _calcularRumbo(
    double lat1,
    double lng1,
    double lat2,
    double lng2,
  ) {
    final dLat = lat2 - lat1;
    final dLng = lng2 - lng1;
    if (dLat.abs() < 0.00001 && dLng.abs() < 0.00001) {
      return null;
    }
    final y = math.sin(dLng * math.pi / 180) * math.cos(lat2 * math.pi / 180);
    final x = math.cos(lat1 * math.pi / 180) * math.sin(lat2 * math.pi / 180) -
        math.sin(lat1 * math.pi / 180) *
            math.cos(lat2 * math.pi / 180) *
            math.cos(dLng * math.pi / 180);
    return (math.atan2(y, x) * 180 / math.pi + 360) % 360;
  }

  void consumirViajeParaRestaurar() {
    state = state.copyWith(viajeParaRestaurar: null);
  }

  Future<void> seleccionarOrigen(String nombre) async {
    await _actualizarRuta(
      pickupLabel: nombre,
      dropoffLabel: state.dropoffLabel,
      origenFijo: nombre == AppStrings.homeMiUbicacion
          ? state.currentLocation
          : null,
    );
  }

  Future<void> seleccionarDestino(String nombre) async {
    await _actualizarRuta(
      pickupLabel: state.pickupLabel,
      dropoffLabel: nombre,
      origenFijo: state.currentLocation,
    );
  }

  Future<void> seleccionarDestinoEnMapa(LatLng destino) async {
    await _actualizarRuta(
      pickupLabel: state.pickupLabel,
      dropoffLabel: AppStrings.formatoPuntoMapa(
        destino.latitude,
        destino.longitude,
      ),
      origenFijo: state.currentLocation,
      destinoFijo: destino,
    );
  }

  Future<void> seleccionarOrigenEnMapa(LatLng origen) async {
    await _actualizarRuta(
      pickupLabel: AppStrings.formatoPuntoMapa(
        origen.latitude,
        origen.longitude,
      ),
      dropoffLabel: state.dropoffLabel,
      origenFijo: origen,
    );
  }

  Future<void> requestTrip() async {
    if (state.currentLocation == null || state.destinationLocation == null) {
      return;
    }

    if (state.tarifaEstimada == null) {
      state = state.copyWith(
        status: HomeStateStatus.error,
        errorMessage: AppStrings.errorEstimarTarifa,
      );
      return;
    }

    state = state.copyWith(status: HomeStateStatus.loading);

    final origen = state.currentLocation!;
    final destino = state.destinationLocation!;
    final origenDireccion = await _resolverDireccionParaApi(
      etiqueta: state.pickupLabel,
      latitud: origen.latitude,
      longitud: origen.longitude,
    );
    final destinoDireccion = await _resolverDireccionParaApi(
      etiqueta: state.dropoffLabel,
      latitud: destino.latitude,
      longitud: destino.longitude,
    );

    final idempotencyKey = _uuid.v4();
    final solicitarViajeUseCase = ref.read(solicitarViajeUseCaseProvider);
    final result = await solicitarViajeUseCase(
      SolicitarViajeParams(
        origenLat: origen.latitude,
        origenLng: origen.longitude,
        destinoLat: destino.latitude,
        destinoLng: destino.longitude,
        origenDireccion: origenDireccion,
        destinoDireccion: destinoDireccion,
        idempotencyKey: idempotencyKey,
      ),
    );

    result.foldLogged(
      'HomeController.requestTrip',
      (failure) {
        state = state.copyWith(
          status: HomeStateStatus.error,
          errorMessage: failure.mensaje,
        );
      },
      (viaje) {
        _detenerFlotaEnMapa();
        state = state.copyWith(
          status: HomeStateStatus.tripRequested,
          activeTrip: viaje,
        );
      },
    );
  }

  Future<void> _actualizarRuta({
    required String pickupLabel,
    required String dropoffLabel,
    LatLng? origenFijo,
    LatLng? destinoFijo,
  }) async {
    final origen =
        origenFijo ??
        (pickupLabel == AppStrings.homeMiUbicacion
            ? state.currentLocation
            : _resolverUbicacion(pickupLabel));
    final destino = destinoFijo ?? _resolverUbicacion(dropoffLabel);

    state = state.copyWith(
      status: HomeStateStatus.selectingDestination,
      pickupLabel: pickupLabel,
      dropoffLabel: dropoffLabel,
      currentLocation: origen,
      destinationLocation: destino,
      tarifaEstimada: null,
      errorMessage: null,
    );

    if (origen == null ||
        destino == null ||
        !_tieneDestinoSeleccionado(dropoffLabel)) {
      state = state.copyWith(
        routePoints: const <LatLng>[],
        routeDistanceKm: 0,
        routeDurationMin: 0,
        tarifaEstimada: null,
      );
      return;
    }

    final obtenerRutaUseCase = ref.read(obtenerRutaUseCaseProvider);
    final resultadoRuta = await obtenerRutaUseCase(
      ObtenerRutaParams(
        origenLat: origen.latitude,
        origenLng: origen.longitude,
        destinoLat: destino.latitude,
        destinoLng: destino.longitude,
      ),
    );

    resultadoRuta.foldLogged(
      'HomeController._actualizarRuta',
      (failure) {
        state = state.copyWith(
          routePoints: const <LatLng>[],
          routeDistanceKm: 0,
          routeDurationMin: 0,
          errorMessage: failure.mensaje,
        );
      },
      (ruta) {
        state = state.copyWith(
          routePoints: ruta.puntos
              .map((punto) => LatLng(punto.latitud, punto.longitud))
              .toList(),
          routeDistanceKm: ruta.distanciaKm,
          routeDurationMin: ruta.duracionMinutos,
          errorMessage: null,
        );
      },
    );

    final estimar = ref.read(estimarTarifaUseCaseProvider);
    final resultadoTarifa = await estimar(
      EstimarTarifaParams(
        origenLat: origen.latitude,
        origenLng: origen.longitude,
        destinoLat: destino.latitude,
        destinoLng: destino.longitude,
      ),
    );

    resultadoTarifa.foldLogged(
      'HomeController._actualizarRuta',
      (failure) {
        state = state.copyWith(
          tarifaEstimada: null,
          errorMessage: failure.mensaje,
        );
      },
      (estimacion) {
        state = state.copyWith(
          tarifaEstimada: estimacion.precio,
          errorMessage: null,
        );
      },
    );
  }

  LatLng? _resolverUbicacion(String nombre) {
    if (nombre == AppStrings.homeMiUbicacion) {
      return state.currentLocation;
    }
    final puntoMapa = _parsearPuntoMapa(nombre);
    if (puntoMapa != null) {
      return puntoMapa;
    }
    return UbicacionesTuristicas.coordenadasPorNombre[nombre];
  }

  bool _tieneDestinoSeleccionado(String dropoffLabel) {
    return dropoffLabel.isNotEmpty &&
        dropoffLabel != AppStrings.homeWhereTo;
  }

  LatLng? _parsearPuntoMapa(String etiqueta) {
    final match = RegExp(
      r'Lat (-?\d+(?:\.\d+)?), Lng (-?\d+(?:\.\d+)?)',
    ).firstMatch(etiqueta);
    if (match == null) {
      return null;
    }
    return LatLng(
      double.parse(match.group(1)!),
      double.parse(match.group(2)!),
    );
  }

  String _direccionParaApi(String etiqueta) {
    final texto = etiqueta.trim();
    if (texto.isEmpty ||
        texto == AppStrings.homeWhereTo ||
        texto == AppStrings.homeLoadingLocation) {
      return AppStrings.homePuntoEnMapa;
    }
    if (_parsearPuntoMapa(texto) != null ||
        texto.startsWith('Lat ') ||
        RegExp(r'^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$').hasMatch(texto)) {
      return AppStrings.homePuntoEnMapa;
    }
    if (texto.length <= 255) {
      return texto;
    }
    return texto.substring(0, 255);
  }

  bool _esEtiquetaGenerica(String etiqueta) {
    final texto = etiqueta.trim();
    return texto.isEmpty ||
        texto == AppStrings.homeWhereTo ||
        texto == AppStrings.homeLoadingLocation ||
        texto == AppStrings.homeMiUbicacion ||
        texto == AppStrings.homePuntoEnMapa ||
        _parsearPuntoMapa(texto) != null ||
        texto.startsWith('Lat ');
  }

  Future<String> _resolverDireccionParaApi({
    required String etiqueta,
    required double latitud,
    required double longitud,
  }) async {
    final base = _direccionParaApi(etiqueta);
    if (!_esEtiquetaGenerica(etiqueta) &&
        base != AppStrings.homePuntoEnMapa &&
        base != AppStrings.homeMiUbicacion) {
      return base;
    }

    final resultado = await ref.read(obtenerDireccionUseCaseProvider)(
      ObtenerDireccionParams(latitud: latitud, longitud: longitud),
    );
    return resultado.fold(
      (_) => base,
      (direccion) {
        final limpio = direccion.trim();
        if (limpio.isEmpty) {
          return base;
        }
        return limpio.length <= 255 ? limpio : limpio.substring(0, 255);
      },
    );
  }
}
