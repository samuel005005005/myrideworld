class ActualizarDisponibilidadParams {
  final bool disponible;
  final double? latitud;
  final double? longitud;

  const ActualizarDisponibilidadParams({
    required this.disponible,
    this.latitud,
    this.longitud,
  });
}
