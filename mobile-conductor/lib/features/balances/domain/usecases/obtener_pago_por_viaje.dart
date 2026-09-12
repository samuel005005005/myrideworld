import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/pago_balance.dart';
import '../repositories/balance_repository.dart';
import 'obtener_pago_por_viaje_params.dart';

class ObtenerPagoPorViaje
    implements UseCase<PagoBalance, ObtenerPagoPorViajeParams> {
  final BalanceRepository repository;

  ObtenerPagoPorViaje(this.repository);

  @override
  Future<Resultado<PagoBalance>> call(ObtenerPagoPorViajeParams params) {
    return repository.obtenerPorViaje(params.viajeId);
  }
}
