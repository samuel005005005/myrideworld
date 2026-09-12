import '../../../../core/tipos/resultado.dart';
import '../entities/usuario.dart';

abstract class AuthRepository {
  Future<Resultado<Usuario>> login(
    String email,
    String password,
    String rol,
  );

  Future<Resultado<Usuario?>> obtenerSesion();

  Future<Resultado<void>> logout();
}
