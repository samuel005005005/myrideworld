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
  final RoutingRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  RoutingRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<RutaViaje>> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final ruta = await remoteDataSource.obtenerRuta(
        origenLat: origenLat,
        origenLng: origenLng,
        destinoLat: destinoLat,
        destinoLng: destinoLng,
      );

      return Exito(ruta);
    } on ServerException catch (e, stack) {
      return falloDesdeError(
        contexto: 'RoutingRepositoryImpl.obtenerRuta',
        error: e,
        stack: stack,
        failure: ServerFailure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'RoutingRepositoryImpl.obtenerRuta',
        error: e,
        stack: stack,
        failure: const ServerFailure(AppStrings.errorObtenerRuta),
      );
    }
  }
}
