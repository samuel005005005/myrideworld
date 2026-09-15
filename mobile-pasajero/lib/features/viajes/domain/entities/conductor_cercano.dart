class ConductorCercano {
  final String id;
  final double latitud;
  final double longitud;
  final String vehiculoColor;
  final double? rumboGrados;

  const ConductorCercano({
    required this.id,
    required this.latitud,
    required this.longitud,
    required this.vehiculoColor,
    this.rumboGrados,
  });

  ConductorCercano copyWith({
    double? latitud,
    double? longitud,
    String? vehiculoColor,
    double? rumboGrados,
  }) {
    return ConductorCercano(
      id: id,
      latitud: latitud ?? this.latitud,
      longitud: longitud ?? this.longitud,
      vehiculoColor: vehiculoColor ?? this.vehiculoColor,
      rumboGrados: rumboGrados ?? this.rumboGrados,
    );
  }
}
