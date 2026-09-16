class ConductorAsignado {
  final String id;
  final String nombreCompleto;
  final String telefono;
  final String? fotoUrl;
  final String vehiculoMarca;
  final String vehiculoModelo;
  final String vehiculoColor;
  final String vehiculoPlaca;
  final double? latitud;
  final double? longitud;

  const ConductorAsignado({
    required this.id,
    required this.nombreCompleto,
    required this.telefono,
    this.fotoUrl,
    required this.vehiculoMarca,
    required this.vehiculoModelo,
    required this.vehiculoColor,
    required this.vehiculoPlaca,
    this.latitud,
    this.longitud,
  });

  String get vehiculoResumen =>
      '$vehiculoColor $vehiculoMarca $vehiculoModelo'.trim();

  bool get tieneUbicacion =>
      latitud != null &&
      longitud != null &&
      latitud != 0 &&
      longitud != 0;
}
