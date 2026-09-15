import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/conductor_cercano.dart';
import '../../domain/repositories/flota_repository.dart';
import '../datasources/flota_remote_datasource.dart';

class FlotaRepositoryImpl implements FlotaRepository {
  final FlotaRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  FlotaRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<List<ConductorCercano>>> listarCercanos({
    required double latitud,
    required double longitud,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final lista = await remoteDataSource.listarCercanos(
        latitud: latitud,
        longitud: longitud,
      );
      return Exito(lista);
    } on ServerException catch (e) {
      return Fallo(ServerFailure(e.mensaje));
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorConductoresCercanos));
    }
  }
}
