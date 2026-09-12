import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/auth_repository.dart';

class Logout implements UseCase<void, NoParams> {
  final AuthRepository repository;

  Logout(this.repository);

  @override
  Future<Resultado<void>> call(NoParams params) {
    return repository.logout();
  }
}
