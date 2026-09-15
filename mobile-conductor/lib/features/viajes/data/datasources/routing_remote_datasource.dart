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
    } on DioException {
      throw const AppException(AppStrings.errorObtenerRuta);
    } on AppException {
      rethrow;
    } catch (error, stack) {
      AppLogger.error('RoutingRemoteDataSource.obtenerRuta', error, stack);
      throw const AppException(AppStrings.errorObtenerRuta);
    }
  }
}
