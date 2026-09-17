import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/logging/app_logger.dart';
import '../mappers/ruta_viaje_mapper.dart';
import '../models/ruta_viaje_model.dart';

class RoutingRemoteDataSource {
  RoutingRemoteDataSource({required this.dio});

  final Dio dio;

  static const int _maxIntentos = 2;

  Future<RutaViajeModel> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
    Object? ultimoError;
    StackTrace? ultimoStack;

    for (var intento = 1; intento <= _maxIntentos; intento++) {
      try {
        final response = await dio.get(
          ApiEndpoints.construirRutaOsrmConduccion(
            origenLat: origenLat,
            origenLng: origenLng,
            destinoLat: destinoLat,
            destinoLng: destinoLng,
          ),
        );

        return RutaViajeMapper.fromJson(response.data as Map<String, dynamic>);
      } on DioException catch (error, stack) {
        ultimoError = error;
        ultimoStack = stack;
        final reintentable = error.type == DioExceptionType.connectionTimeout ||
            error.type == DioExceptionType.receiveTimeout ||
            error.type == DioExceptionType.connectionError;
        if (!reintentable || intento == _maxIntentos) {
          break;
        }
        AppLogger.warning(
          'RoutingRemoteDataSource.obtenerRuta',
          'Timeout OSRM, reintento $intento/$_maxIntentos',
        );
      } on AppException {
        rethrow;
      } catch (error, stack) {
        AppLogger.error('RoutingRemoteDataSource.obtenerRuta', error, stack);
        throw const AppException(AppStrings.errorObtenerRuta);
      }
    }

    AppLogger.warning(
      'RoutingRemoteDataSource.obtenerRuta',
      'OSRM no respondió: $ultimoError',
      ultimoStack,
    );
    throw const AppException(AppStrings.errorObtenerRuta);
  }
}
