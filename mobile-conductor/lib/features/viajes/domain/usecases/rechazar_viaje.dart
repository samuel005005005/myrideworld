import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';
import 'rechazar_viaje_params.dart';

class RechazarViaje implements UseCase<Viaje, RechazarViajeParams> {
  final ViajeRepository repository;

  RechazarViaje(this.repository);

  @override
  Future<Resultado<Viaje>> call(RechazarViajeParams params) {
    return repository.rechazarViaje(viajeId: params.viajeId);
  }
}
