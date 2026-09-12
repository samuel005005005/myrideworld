import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:uuid/uuid.dart';

import '../../domain/entities/viaje.dart';
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
  final Viaje? activeTrip;
  final String? errorMessage;

  HomeState({
    required this.status,
    this.currentLocation,
    this.destinationLocation,
    this.activeTrip,
    this.errorMessage,
  });

  HomeState copyWith({
    HomeStateStatus? status,
    LatLng? currentLocation,
    LatLng? destinationLocation,
    Viaje? activeTrip,
    String? errorMessage,
  }) {
    return HomeState(
      status: status ?? this.status,
      currentLocation: currentLocation ?? this.currentLocation,
      destinationLocation: destinationLocation ?? this.destinationLocation,
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

  @override
  HomeState build() {
    return HomeState(status: HomeStateStatus.initial);
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

  Future<void> requestTrip() async {
    if (state.currentLocation == null || state.destinationLocation == null) return;

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
}
