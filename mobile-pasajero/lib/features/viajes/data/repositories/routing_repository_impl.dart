import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/ruta_viaje.dart';
import '../../domain/repositories/routing_repository.dart';
import '../datasources/routing_remote_datasource.dart';

class RoutingRepositoryImpl implements RoutingRepository {
  final RoutingRemoteDataSource remoteDataSource;

  RoutingRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Resultado<RutaViaje>> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
    try {
      final ruta = await remoteDataSource.obtenerRuta(
        origenLat: origenLat,
        origenLng: origenLng,
        destinoLat: destinoLat,
        destinoLng: destinoLng,
      );

      return Exito(ruta);
    } on ServerException catch (e) {
      return Fallo(ServerFailure(e.mensaje));
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorObtenerRuta));
    }
  }
}
