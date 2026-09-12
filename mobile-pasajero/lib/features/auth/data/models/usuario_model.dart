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
}
