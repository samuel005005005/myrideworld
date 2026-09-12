import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';
import 'obtener_viaje_por_id_params.dart';

class ObtenerViajePorIdUseCase
    implements UseCase<Viaje, ObtenerViajePorIdParams> {
  final ViajeRepository repository;

  ObtenerViajePorIdUseCase(this.repository);

  @override
  Future<Resultado<Viaje>> call(ObtenerViajePorIdParams params) {
    return repository.obtenerViajePorId(params.viajeId);
  }
}
