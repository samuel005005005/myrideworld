import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class IniciarViaje implements UseCase<Viaje, String> {
  final ViajeRepository repository;

  IniciarViaje(this.repository);

  @override
  Future<Resultado<Viaje>> call(String params) {
    return repository.iniciarViaje(params);
  }
}
