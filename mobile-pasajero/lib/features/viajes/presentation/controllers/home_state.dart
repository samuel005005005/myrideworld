import 'package:latlong2/latlong.dart';

import '../../domain/entities/viaje.dart';
import 'home_state_status.dart';

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

  const HomeState({
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
