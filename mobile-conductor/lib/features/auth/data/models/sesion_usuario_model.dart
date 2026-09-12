class SesionUsuarioModel {
  final String token;
  final String? userId;
  final String? rol;
  final String? email;

  const SesionUsuarioModel({
    required this.token,
    this.userId,
    this.rol,
    this.email,
  });
}
