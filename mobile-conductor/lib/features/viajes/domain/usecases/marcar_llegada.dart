import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class MarcarLlegada implements UseCase<Viaje, String> {
  final ViajeRepository repository;

  MarcarLlegada(this.repository);

  @override
  Future<Resultado<Viaje>> call(String params) {
    return repository.marcarLlegada(params);
  }
}
