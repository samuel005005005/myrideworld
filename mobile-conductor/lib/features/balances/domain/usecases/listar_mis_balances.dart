import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/pago_balance.dart';
import '../repositories/balance_repository.dart';

class ListarMisBalances implements UseCase<List<PagoBalance>, NoParams> {
  final BalanceRepository repository;

  ListarMisBalances(this.repository);

  @override
  Future<Resultado<List<PagoBalance>>> call(NoParams params) {
    return repository.listarMisBalances();
  }
}
