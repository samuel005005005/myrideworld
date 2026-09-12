import '../../domain/entities/usuario.dart';
import '../models/usuario_model.dart';

class UsuarioMapper {
  static UsuarioModel fromJson(Map<String, dynamic> json) {
    final userMap = json['user'] as Map<String, dynamic>;
    return UsuarioModel(
      id: userMap['id'] as String,
      nombreCompleto: userMap['nombreCompleto'] as String,
      email: userMap['email'] as String,
      telefono: userMap['telefono'] as String?,
      rol: userMap['rol'] as String,
      token: json['access_token'] as String,
    );
  }

  static Map<String, dynamic> toJson(Usuario usuario) {
    return {
      'access_token': usuario.token,
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
