import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/ruta_viaje.dart';
import '../../domain/repositories/routing_repository.dart';
import '../datasources/routing_remote_datasource.dart';

class RoutingRepositoryImpl implements RoutingRepository {
  RoutingRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  final RoutingRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  @override
  Future<Resultado<RutaViaje>> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }

    try {
      final ruta = await remoteDataSource.obtenerRuta(
        origenLat: origenLat,
        origenLng: origenLng,
        destinoLat: destinoLat,
        destinoLng: destinoLng,
      );
      return Exito(ruta);
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'RoutingRepositoryImpl.obtenerRuta',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (error, stack) {
      return falloDesdeError(
        contexto: 'RoutingRepositoryImpl.obtenerRuta',
        error: error,
        stack: stack,
        failure: const Failure(AppStrings.errorObtenerRuta),
      );
    }
  }
}
