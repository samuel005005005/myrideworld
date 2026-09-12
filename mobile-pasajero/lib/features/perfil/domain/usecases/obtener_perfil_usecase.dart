import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/perfil_pasajero.dart';
import '../repositories/perfil_repository.dart';

class ObtenerPerfilUseCase implements UseCase<PerfilPasajero, NoParams> {
  final PerfilRepository repository;

  ObtenerPerfilUseCase(this.repository);

  @override
  Future<Resultado<PerfilPasajero>> call(NoParams params) {
    return repository.obtenerPerfil();
  }
}
