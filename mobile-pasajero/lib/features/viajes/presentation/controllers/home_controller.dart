import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:uuid/uuid.dart';

import '../../../../core/constants/ubicaciones_turisticas.dart';
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
    final origenInicial = UbicacionesTuristicas.aeropuertoPuntaCana;
    final destinoInicial = UbicacionesTuristicas.hardRockHotel;

    return HomeState(
      status: HomeStateStatus.initial,
      currentLocation: _resolverUbicacion(origenInicial),
      destinationLocation: _resolverUbicacion(destinoInicial),
      pickupLabel: origenInicial,
      dropoffLabel: destinoInicial,
      routePoints: const <LatLng>[],
      routeDistanceKm: 0,
      routeDurationMin: 0,
    );
  }

  Future<void> inicializar() async {
    if (_yaInicializado) {
      return;
    }

    _yaInicializado = true;
    await _actualizarRuta(
      pickupLabel: state.pickupLabel,
      dropoffLabel: state.dropoffLabel,
    );
  }

  void updateCurrentLocation(LatLng location) {
    state = state.copyWith(
      status: HomeStateStatus.selectingDestination,
      currentLocation: location,
      destinationLocation: location,
    );
  }

  void updateDestination(LatLng location) {
    if (state.status == HomeStateStatus.selectingDestination) {
      state = state.copyWith(destinationLocation: location);
    }
  }

  Future<void> seleccionarOrigen(String nombre) async {
    await _actualizarRuta(
      pickupLabel: nombre,
      dropoffLabel: state.dropoffLabel,
    );
  }

  Future<void> seleccionarDestino(String nombre) async {
    await _actualizarRuta(pickupLabel: state.pickupLabel, dropoffLabel: nombre);
  }

  Future<void> requestTrip() async {
    if (state.currentLocation == null || state.destinationLocation == null) {
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

    result.fold(
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
  }) async {
    final origen = _resolverUbicacion(pickupLabel);
    final destino = _resolverUbicacion(dropoffLabel);

    state = state.copyWith(
      status: HomeStateStatus.selectingDestination,
      pickupLabel: pickupLabel,
      dropoffLabel: dropoffLabel,
      currentLocation: origen,
      destinationLocation: destino,
      errorMessage: null,
    );

    if (origen == null || destino == null) {
      state = state.copyWith(
        routePoints: const <LatLng>[],
        routeDistanceKm: 0,
        routeDurationMin: 0,
      );
      return;
    }

    final obtenerRutaUseCase = ref.read(obtenerRutaUseCaseProvider);
    final resultado = await obtenerRutaUseCase(
      ObtenerRutaParams(
        origenLat: origen.latitude,
        origenLng: origen.longitude,
        destinoLat: destino.latitude,
        destinoLng: destino.longitude,
      ),
    );

    resultado.fold(
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
  }

  LatLng? _resolverUbicacion(String nombre) {
    return UbicacionesTuristicas.coordenadasPorNombre[nombre];
  }
}
