import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/estimacion_tarifa.dart';
import '../../domain/repositories/tarifa_repository.dart';
import '../datasources/tarifa_remote_datasource.dart';

class TarifaRepositoryImpl implements TarifaRepository {
  final TarifaRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  TarifaRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<EstimacionTarifa>> estimar({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final estimacion = await remoteDataSource.estimar(
        origenLat: origenLat,
        origenLng: origenLng,
        destinoLat: destinoLat,
        destinoLng: destinoLng,
      );
      return Exito(estimacion);
    } on ServerException catch (e, stack) {
      return falloDesdeError(
        contexto: 'TarifaRepositoryImpl.estimar',
        error: e,
        stack: stack,
        failure: ServerFailure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'TarifaRepositoryImpl.estimar',
        error: e,
        stack: stack,
        failure: const ServerFailure(AppStrings.errorUnexpected),
      );
    }
  }
}
