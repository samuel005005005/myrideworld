import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class ListarMisViajesUseCase implements UseCase<List<Viaje>, NoParams> {
  final ViajeRepository repository;

  ListarMisViajesUseCase(this.repository);

  @override
  Future<Resultado<List<Viaje>>> call(NoParams params) {
    return repository.listarMisViajes();
  }
}
