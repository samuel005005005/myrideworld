import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';
import 'solicitar_viaje_params.dart';

class SolicitarViajeUseCase implements UseCase<Viaje, SolicitarViajeParams> {
  final ViajeRepository repository;

  SolicitarViajeUseCase(this.repository);

  @override
  Future<Resultado<Viaje>> call(SolicitarViajeParams params) async {
    return await repository.solicitarViaje(
      origenLat: params.origenLat,
      origenLng: params.origenLng,
      destinoLat: params.destinoLat,
      destinoLng: params.destinoLng,
      origenDireccion: params.origenDireccion,
      destinoDireccion: params.destinoDireccion,
      idempotencyKey: params.idempotencyKey,
    );
  }
}
