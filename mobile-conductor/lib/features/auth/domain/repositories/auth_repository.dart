import '../../../../core/tipos/resultado.dart';
import '../entities/sesion_usuario.dart';

abstract class AuthRepository {
  Future<Resultado<SesionUsuario>> iniciarSesion({
    required String email,
    required String password,
    required String rol,
  });
}
