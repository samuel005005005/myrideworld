import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/pago_balance.dart';
import '../../domain/repositories/balance_repository.dart';
import '../datasources/balance_remote_datasource.dart';

class BalanceRepositoryImpl implements BalanceRepository {
  final BalanceRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  BalanceRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<List<PagoBalance>>> listarMisBalances() async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }
    try {
      return Exito(await remoteDataSource.listarMisBalances());
    } on AppException catch (e, stack) {
      return falloDesdeError(
        contexto: 'BalanceRepositoryImpl.listarMisBalances',
        error: e,
        stack: stack,
        failure: Failure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'BalanceRepositoryImpl.listarMisBalances',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorBalances),
      );
    }
  }

  @override
  Future<Resultado<PagoBalance>> obtenerPorViaje(String viajeId) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }
    try {
      return Exito(await remoteDataSource.obtenerPorViaje(viajeId));
    } on AppException catch (e, stack) {
      return falloDesdeError(
        contexto: 'BalanceRepositoryImpl.obtenerPorViaje',
        error: e,
        stack: stack,
        failure: Failure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'BalanceRepositoryImpl.obtenerPorViaje',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorBalances),
      );
    }
  }
}
