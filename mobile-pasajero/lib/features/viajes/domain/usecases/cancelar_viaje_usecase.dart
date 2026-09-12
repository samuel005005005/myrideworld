import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';
import 'cancelar_viaje_params.dart';

class CancelarViajeUseCase implements UseCase<Viaje, CancelarViajeParams> {
  final ViajeRepository repository;

  CancelarViajeUseCase(this.repository);

  @override
  Future<Resultado<Viaje>> call(CancelarViajeParams params) {
    return repository.cancelarViaje(
      viajeId: params.viajeId,
      motivo: params.motivo,
    );
  }
}
