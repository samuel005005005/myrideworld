class PerfilPasajero {
  final String id;
  final String nombreCompleto;
  final String email;
  final String? telefono;
  final String estado;

  const PerfilPasajero({
    required this.id,
    required this.nombreCompleto,
    required this.email,
    this.telefono,
    required this.estado,
  });
}
