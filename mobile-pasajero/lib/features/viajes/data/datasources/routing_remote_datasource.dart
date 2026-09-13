import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/logging/app_logger.dart';
import '../mappers/ruta_viaje_mapper.dart';
import '../models/ruta_viaje_model.dart';

abstract class RoutingRemoteDataSource {
  Future<RutaViajeModel> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  });
}

class RoutingRemoteDataSourceImpl implements RoutingRemoteDataSource {
  final Dio dio;

  RoutingRemoteDataSourceImpl({required this.dio});

  @override
  Future<RutaViajeModel> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
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
    } on DioException catch (e) {
      if (e.response?.data != null) {
        final payload = e.response?.data;
        if (payload is Map<String, dynamic>) {
          final message = payload['message'] ?? AppStrings.errorObtenerRuta;
          throw ServerException(message.toString());
        }
      }

      throw ServerException(AppStrings.errorServerConnection);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('RoutingRemoteDataSourceImpl.obtenerRuta', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }
}
