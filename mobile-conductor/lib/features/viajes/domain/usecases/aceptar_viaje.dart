import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';
import 'aceptar_viaje_params.dart';

class AceptarViaje implements UseCase<Viaje, AceptarViajeParams> {
  final ViajeRepository repository;

  AceptarViaje(this.repository);

  @override
  Future<Resultado<Viaje>> call(AceptarViajeParams params) {
    return repository.aceptarViaje(
      viajeId: params.viajeId,
      conductorId: params.conductorId,
    );
  }
}
