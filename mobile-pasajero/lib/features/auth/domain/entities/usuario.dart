class Usuario {
  final String id;
  final String nombreCompleto;
  final String email;
  final String? telefono;
  final String rol;

  const Usuario({
    required this.id,
    required this.nombreCompleto,
    required this.email,
    this.telefono,
    required this.rol,
  });
}
