import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/app_logger.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/coordenada.dart';
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

  /// Misma heurística que el ETA en viaje activo (~30 km/h).
  static const double _metrosPorMinutoEstimado = 500;
  static const Distance _distancia = Distance();

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
      AppLogger.warning(
        'RoutingRepositoryImpl.obtenerRuta',
        'OSRM falló; usando trazo recto. ${e.mensaje}',
        stack,
      );
      return Exito(
        _rutaRecta(
          origenLat: origenLat,
          origenLng: origenLng,
          destinoLat: destinoLat,
          destinoLng: destinoLng,
        ),
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

  RutaViaje _rutaRecta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) {
    final origen = LatLng(origenLat, origenLng);
    final destino = LatLng(destinoLat, destinoLng);
    final metros = _distancia.as(LengthUnit.Meter, origen, destino);
    final minutos = metros <= 0 ? 0 : (metros / _metrosPorMinutoEstimado).ceil();

    return RutaViaje(
      puntos: [
        Coordenada(latitud: origenLat, longitud: origenLng),
        Coordenada(latitud: destinoLat, longitud: destinoLng),
      ],
      distanciaKm: metros / 1000,
      duracionMinutos: minutos,
    );
  }
}
