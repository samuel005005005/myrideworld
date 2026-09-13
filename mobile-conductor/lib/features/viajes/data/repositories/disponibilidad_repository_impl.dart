import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/repositories/disponibilidad_repository.dart';
import '../datasources/viaje_remote_datasource.dart';

class DisponibilidadRepositoryImpl implements DisponibilidadRepository {
  final ViajeRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  DisponibilidadRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<void>> actualizarDisponibilidad({
    required bool disponible,
    double? latitud,
    double? longitud,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }

    try {
      await remoteDataSource.actualizarDisponibilidad(
        disponible: disponible,
        latitud: latitud,
        longitud: longitud,
      );
      return const Exito(null);
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'DisponibilidadRepositoryImpl.actualizarDisponibilidad',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'DisponibilidadRepositoryImpl.actualizarDisponibilidad',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorDisponibilidad),
      );
    }
  }

  @override
  Future<Resultado<void>> actualizarUbicacion({
    required double latitud,
    required double longitud,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }
    try {
      await remoteDataSource.actualizarUbicacionConductor(
        latitud: latitud,
        longitud: longitud,
      );
      return const Exito(null);
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'DisponibilidadRepositoryImpl.actualizarUbicacion',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'DisponibilidadRepositoryImpl.actualizarUbicacion',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorGpsObtener),
      );
    }
  }
}
