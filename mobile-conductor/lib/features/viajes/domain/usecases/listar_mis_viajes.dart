import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class ListarMisViajes implements UseCase<List<Viaje>, NoParams> {
  final ViajeRepository repository;

  ListarMisViajes(this.repository);

  @override
  Future<Resultado<List<Viaje>>> call(NoParams params) {
    return repository.listarMisViajes();
  }
}
