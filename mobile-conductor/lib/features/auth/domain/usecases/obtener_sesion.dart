import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/sesion_usuario.dart';
import '../repositories/auth_repository.dart';

class ObtenerSesion implements UseCase<SesionUsuario?, NoParams> {
  final AuthRepository repository;

  ObtenerSesion(this.repository);

  @override
  Future<Resultado<SesionUsuario?>> call(NoParams params) {
    return repository.obtenerSesion();
  }
}
