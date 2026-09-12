import '../../../../core/tipos/resultado.dart';
import '../entities/pago_balance.dart';

abstract class BalanceRepository {
  Future<Resultado<List<PagoBalance>>> listarMisBalances();

  Future<Resultado<PagoBalance>> obtenerPorViaje(String viajeId);
}
