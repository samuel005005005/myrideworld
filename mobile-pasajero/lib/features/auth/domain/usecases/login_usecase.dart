import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/usuario.dart';
import '../repositories/auth_repository.dart';
import 'login_params.dart';

class LoginUseCase implements UseCase<Usuario, LoginParams> {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  @override
  Future<Resultado<Usuario>> call(LoginParams params) {
    return repository.login(params.email, params.password, params.rol);
  }
}
