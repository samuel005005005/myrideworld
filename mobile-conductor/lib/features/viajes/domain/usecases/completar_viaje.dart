import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class CompletarViaje implements UseCase<Viaje, String> {
  final ViajeRepository repository;

  CompletarViaje(this.repository);

  @override
  Future<Resultado<Viaje>> call(String params) {
    return repository.completarViaje(params);
  }
}
