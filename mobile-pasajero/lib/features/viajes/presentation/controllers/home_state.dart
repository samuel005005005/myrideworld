import 'package:latlong2/latlong.dart';

import '../../domain/entities/conductor_cercano.dart';
import '../../domain/entities/viaje.dart';
import 'home_state_status.dart';

class HomeState {
  static const Object _sinCambio = Object();

  final HomeStateStatus status;
  final LatLng? currentLocation;
  final LatLng? destinationLocation;
  final String pickupLabel;
  final String dropoffLabel;
  final List<LatLng> routePoints;
  final double routeDistanceKm;
  final int routeDurationMin;
  final double? tarifaEstimada;
  final Viaje? activeTrip;
  final Viaje? viajeParaRestaurar;
  final List<ConductorCercano> conductoresCercanos;
  final String? errorMessage;

  const HomeState({
    required this.status,
    this.currentLocation,
    this.destinationLocation,
    required this.pickupLabel,
    required this.dropoffLabel,
    required this.routePoints,
    required this.routeDistanceKm,
    required this.routeDurationMin,
    this.tarifaEstimada,
    this.activeTrip,
    this.viajeParaRestaurar,
    this.conductoresCercanos = const [],
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
    Object? tarifaEstimada = _sinCambio,
    Object? activeTrip = _sinCambio,
    Object? viajeParaRestaurar = _sinCambio,
    List<ConductorCercano>? conductoresCercanos,
    Object? errorMessage = _sinCambio,
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
      tarifaEstimada: identical(tarifaEstimada, _sinCambio)
          ? this.tarifaEstimada
          : tarifaEstimada as double?,
      activeTrip: identical(activeTrip, _sinCambio)
          ? this.activeTrip
          : activeTrip as Viaje?,
      viajeParaRestaurar: identical(viajeParaRestaurar, _sinCambio)
          ? this.viajeParaRestaurar
          : viajeParaRestaurar as Viaje?,
      conductoresCercanos: conductoresCercanos ?? this.conductoresCercanos,
      errorMessage: identical(errorMessage, _sinCambio)
          ? this.errorMessage
          : errorMessage as String?,
    );
  }
}
