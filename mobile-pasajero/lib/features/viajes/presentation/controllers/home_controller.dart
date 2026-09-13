import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:uuid/uuid.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/constants/ubicaciones_turisticas.dart';
import '../../domain/usecases/estimar_tarifa_params.dart';
import '../../domain/usecases/obtener_ruta_usecase.dart';
import '../../domain/usecases/solicitar_viaje_usecase.dart';
import '../providers/viajes_provider.dart';
import 'home_state.dart';
import 'home_state_status.dart';

final homeControllerProvider = NotifierProvider<HomeController, HomeState>(() {
  return HomeController();
});

class HomeController extends Notifier<HomeState> {
  final _uuid = const Uuid();
  bool _yaInicializado = false;

  @override
  HomeState build() {
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

    final idempotencyKey = _uuid.v4();
    final solicitarViajeUseCase = ref.read(solicitarViajeUseCaseProvider);
    final result = await solicitarViajeUseCase(
      SolicitarViajeParams(
        origenLat: state.currentLocation!.latitude,
        origenLng: state.currentLocation!.longitude,
        destinoLat: state.destinationLocation!.latitude,
        destinoLng: state.destinationLocation!.longitude,
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
}
