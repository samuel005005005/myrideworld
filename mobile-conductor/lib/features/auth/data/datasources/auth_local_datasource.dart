import '../../../../core/storage/session_storage.dart';
import '../../domain/entities/sesion_usuario.dart';
import '../models/sesion_usuario_model.dart';
import '../mappers/sesion_usuario_mapper.dart';

class AuthLocalDataSource {
  final SessionStorage sessionStorage;

  AuthLocalDataSource({required this.sessionStorage});

  Future<void> guardarSesion(SesionUsuarioModel modelo) async {
    final sesion = SesionUsuarioMapper.toDomain(modelo);
    await sessionStorage.guardarSesion(token: modelo.token, sesion: sesion);
  }

  Future<SesionUsuario?> obtenerSesion() => sessionStorage.obtenerSesion();

  Future<String?> obtenerToken() => sessionStorage.obtenerToken();

  Future<void> limpiar() => sessionStorage.limpiar();
}
