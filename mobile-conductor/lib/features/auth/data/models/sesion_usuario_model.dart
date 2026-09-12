class SesionUsuarioModel {
  final String token;
  final String? userId;
  final String? rol;

  const SesionUsuarioModel({required this.token, this.userId, this.rol});
}
