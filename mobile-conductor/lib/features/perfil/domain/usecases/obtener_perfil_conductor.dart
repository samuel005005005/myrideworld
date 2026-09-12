import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/perfil_conductor.dart';
import '../repositories/perfil_repository.dart';

class ObtenerPerfilConductor implements UseCase<PerfilConductor, NoParams> {
  final PerfilRepository repository;

  ObtenerPerfilConductor(this.repository);

  @override
  Future<Resultado<PerfilConductor>> call(NoParams params) {
    return repository.obtenerPerfil();
  }
}
