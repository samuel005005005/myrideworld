import '../../features/auth/domain/entities/sesion_usuario.dart';

abstract class SessionStorage {
  Future<void> guardarSesion({
    required String token,
    required SesionUsuario sesion,
  });

  Future<String?> obtenerToken();

  Future<SesionUsuario?> obtenerSesion();

  Future<void> limpiar();
}
