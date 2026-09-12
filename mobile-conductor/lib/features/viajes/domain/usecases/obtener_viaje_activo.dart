import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class ObtenerViajeActivo implements UseCase<Viaje?, NoParams> {
  final ViajeRepository repository;

  ObtenerViajeActivo(this.repository);

  @override
  Future<Resultado<Viaje?>> call(NoParams params) {
    return repository.obtenerViajeActivo();
  }
}
