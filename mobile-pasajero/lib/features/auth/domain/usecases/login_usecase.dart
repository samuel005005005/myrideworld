import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/usuario.dart';
import '../repositories/auth_repository.dart';

class LoginUseCase implements UseCase<Usuario, LoginParams> {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  @override
  Future<Resultado<Usuario>> call(LoginParams params) async {
    return await repository.login(params.email, params.password, params.rol);
  }
}

class LoginParams {
  final String email;
  final String password;
  final String rol;

  const LoginParams({
    required this.email,
    required this.password,
    required this.rol,
  });
}
