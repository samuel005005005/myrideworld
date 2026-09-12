import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/usuario.dart';
import '../repositories/auth_repository.dart';

class ObtenerSesionUseCase implements UseCase<Usuario?, NoParams> {
  final AuthRepository repository;

  ObtenerSesionUseCase(this.repository);

  @override
  Future<Resultado<Usuario?>> call(NoParams params) {
    return repository.obtenerSesion();
  }
}
