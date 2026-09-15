import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/conductor_cercano.dart';
import '../repositories/flota_repository.dart';
import 'obtener_conductores_cercanos_params.dart';

class ObtenerConductoresCercanosUseCase
    implements UseCase<List<ConductorCercano>, ObtenerConductoresCercanosParams> {
  final FlotaRepository repository;

  ObtenerConductoresCercanosUseCase(this.repository);

  @override
  Future<Resultado<List<ConductorCercano>>> call(
    ObtenerConductoresCercanosParams params,
  ) {
    return repository.listarCercanos(
      latitud: params.latitud,
      longitud: params.longitud,
    );
  }
}
