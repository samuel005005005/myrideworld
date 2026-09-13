import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
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
    } on AppException catch (error) {
      return Fallo(Failure(error.mensaje));
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
    } on AppException catch (error) {
      return Fallo(Failure(error.mensaje));
    }
  }
}
