import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/repositories/geocoding_repository.dart';
import '../datasources/geocoding_remote_datasource.dart';

class GeocodingRepositoryImpl implements GeocodingRepository {
  GeocodingRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  final GeocodingRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  @override
  Future<Resultado<String>> obtenerDireccion({
    required double latitud,
    required double longitud,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final texto = await remoteDataSource.obtenerDireccion(
        latitud: latitud,
        longitud: longitud,
      );
      return Exito(texto);
    } on ServerException catch (error, stack) {
      return falloDesdeError(
        contexto: 'GeocodingRepositoryImpl.obtenerDireccion',
        error: error,
        stack: stack,
        failure: ServerFailure(error.mensaje),
      );
    } catch (error, stack) {
      return falloDesdeError(
        contexto: 'GeocodingRepositoryImpl.obtenerDireccion',
        error: error,
        stack: stack,
        failure: const ServerFailure(AppStrings.errorObtenerDireccion),
      );
    }
  }
}
