import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:latlong2/latlong.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

import '../../../../core/constants/env_keys.dart';
import '../../../../core/constants/ubicaciones_turisticas.dart';
import '../../../auth/domain/usecases/login_usecase.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/usecases/obtener_ruta_usecase.dart';
import '../../domain/usecases/solicitar_viaje_usecase.dart';
import '../providers/viajes_provider.dart';

enum HomeStateStatus {
  initial, // Buscando GPS o esperando acción
  selectingDestination, // Moviendo el mapa para elegir destino
  loading, // Solicitando viaje al backend
  tripRequested, // Viaje creado, esperando conductor
  error,
}

class HomeState {
  final HomeStateStatus status;
  final LatLng? currentLocation;
  final LatLng? destinationLocation;
  final String pickupLabel;
  final String dropoffLabel;
  final List<LatLng> routePoints;
  final double routeDistanceKm;
  final int routeDurationMin;
  final Viaje? activeTrip;
  final String? errorMessage;

  HomeState({
    required this.status,
    this.currentLocation,
    this.destinationLocation,
    required this.pickupLabel,
    required this.dropoffLabel,
    required this.routePoints,
    required this.routeDistanceKm,
    required this.routeDurationMin,
    this.activeTrip,
    this.errorMessage,
  });

  HomeState copyWith({
    HomeStateStatus? status,
    LatLng? currentLocation,
    LatLng? destinationLocation,
    String? pickupLabel,
    String? dropoffLabel,
    List<LatLng>? routePoints,
    double? routeDistanceKm,
    int? routeDurationMin,
    Viaje? activeTrip,
    String? errorMessage,
  }) {
    return HomeState(
      status: status ?? this.status,
      currentLocation: currentLocation ?? this.currentLocation,
      destinationLocation: destinationLocation ?? this.destinationLocation,
      pickupLabel: pickupLabel ?? this.pickupLabel,
      dropoffLabel: dropoffLabel ?? this.dropoffLabel,
      routePoints: routePoints ?? this.routePoints,
      routeDistanceKm: routeDistanceKm ?? this.routeDistanceKm,
      routeDurationMin: routeDurationMin ?? this.routeDurationMin,
      activeTrip: activeTrip ?? this.activeTrip,
      errorMessage: errorMessage,
    );
  }
}

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
    await _asegurarSesionMvp();
    await _actualizarRuta(
      pickupLabel: state.pickupLabel,
      dropoffLabel: state.dropoffLabel,
    );
  }

  void updateCurrentLocation(LatLng location) {
    state = state.copyWith(
      status: HomeStateStatus.selectingDestination,
      currentLocation: location,
      // Por defecto el destino inicia donde estamos parados
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
    if (state.currentLocation == null || state.destinationLocation == null)
      return;

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

  Future<void> _asegurarSesionMvp() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');
    final userId = prefs.getString('user_id');

    if ((token?.isNotEmpty ?? false) && (userId?.isNotEmpty ?? false)) {
      return;
    }

    final loginUseCase = ref.read(loginUseCaseProvider);
    await loginUseCase(
      LoginParams(
        email: dotenv.env[EnvKeys.mvpAutoLoginEmail] ?? 'pasajero@myride.com',
        password: dotenv.env[EnvKeys.mvpAutoLoginPassword] ?? '12345678',
        rol: dotenv.env[EnvKeys.mvpAutoLoginRol] ?? 'pasajero',
      ),
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
