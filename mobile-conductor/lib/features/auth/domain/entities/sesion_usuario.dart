class SesionUsuario {
  final String token;
  final String userId;
  final String rol;

  const SesionUsuario({
    required this.token,
    required this.userId,
    required this.rol,
  });
}
