class ConductorAsignado {
  final String id;
  final String nombreCompleto;
  final String telefono;
  final String? fotoUrl;
  final String vehiculoMarca;
  final String vehiculoModelo;
  final String vehiculoColor;
  final String vehiculoPlaca;

  const ConductorAsignado({
    required this.id,
    required this.nombreCompleto,
    required this.telefono,
    this.fotoUrl,
    required this.vehiculoMarca,
    required this.vehiculoModelo,
    required this.vehiculoColor,
    required this.vehiculoPlaca,
  });

  String get vehiculoResumen =>
      '$vehiculoColor $vehiculoMarca $vehiculoModelo'.trim();
}
