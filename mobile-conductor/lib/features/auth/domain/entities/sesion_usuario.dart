class SesionUsuario {
  final String userId;
  final String rol;
  final String? email;
  final String? nombreCompleto;

  const SesionUsuario({
    required this.userId,
    required this.rol,
    this.email,
    this.nombreCompleto,
  });
}
