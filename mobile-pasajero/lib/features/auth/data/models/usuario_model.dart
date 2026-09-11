import '../../domain/entities/usuario.dart';

class UsuarioModel extends Usuario {
  const UsuarioModel({
    required super.id,
    required super.nombreCompleto,
    required super.email,
    super.telefono,
    required super.rol,
    required super.token,
  });

  factory UsuarioModel.fromJson(Map<String, dynamic> json) {
    // El backend de MyRide en login devuelve { access_token, user: { id, nombreCompleto, email, telefono, rol } }
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

  Map<String, dynamic> toJson() {
    return {
      'access_token': token,
      'user': {
        'id': id,
        'nombreCompleto': nombreCompleto,
        'email': email,
        'telefono': telefono,
        'rol': rol,
      }
    };
  }
}
