import '../../features/auth/domain/entities/usuario.dart';

/// Puerto de infraestructura para persistir la sesión de autenticación.
abstract class SessionStorage {
  Future<void> guardarSesion({
    required String token,
    required Usuario usuario,
  });

  Future<String?> obtenerToken();

  Future<Usuario?> obtenerUsuario();

  Future<String?> obtenerUsuarioId();

  Future<void> actualizarUsuario(Usuario usuario);

  Future<void> limpiar();
}
