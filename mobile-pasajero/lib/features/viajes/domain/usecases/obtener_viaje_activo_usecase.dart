import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class ObtenerViajeActivoUseCase implements UseCase<Viaje?, NoParams> {
  ObtenerViajeActivoUseCase(this._repository);

  final ViajeRepository _repository;

  @override
  Future<Resultado<Viaje?>> call(NoParams params) {
    return _repository.obtenerViajeActivo();
  }
}
