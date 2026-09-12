import '../models/credenciales_auth_model.dart';
import '../models/usuario_model.dart';

class UsuarioMapper {
  static CredencialesAuthModel fromJson(Map<String, dynamic> json) {
    final userMap = json['user'] as Map<String, dynamic>;
    return CredencialesAuthModel(
      accessToken: json['access_token'] as String,
      usuario: UsuarioModel(
        id: userMap['id'] as String,
        nombreCompleto: userMap['nombreCompleto'] as String,
        email: userMap['email'] as String,
        telefono: userMap['telefono'] as String?,
        rol: userMap['rol'] as String,
      ),
    );
  }

  static Map<String, dynamic> toJson(CredencialesAuthModel credenciales) {
    final usuario = credenciales.usuario;
    return {
      'access_token': credenciales.accessToken,
      'user': {
        'id': usuario.id,
        'nombreCompleto': usuario.nombreCompleto,
        'email': usuario.email,
        'telefono': usuario.telefono,
        'rol': usuario.rol,
      },
    };
  }
}
