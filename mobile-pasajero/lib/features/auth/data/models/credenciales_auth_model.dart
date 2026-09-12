import 'usuario_model.dart';

class CredencialesAuthModel {
  final UsuarioModel usuario;
  final String accessToken;

  const CredencialesAuthModel({
    required this.usuario,
    required this.accessToken,
  });
}
