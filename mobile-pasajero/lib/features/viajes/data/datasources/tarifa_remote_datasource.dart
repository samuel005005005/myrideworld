import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../mappers/estimacion_tarifa_mapper.dart';
import '../../domain/entities/estimacion_tarifa.dart';

abstract class TarifaRemoteDataSource {
  Future<EstimacionTarifa> estimar({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  });
}

class TarifaRemoteDataSourceImpl implements TarifaRemoteDataSource {
  final Dio dio;

  TarifaRemoteDataSourceImpl({required this.dio});

  @override
  Future<EstimacionTarifa> estimar({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
    try {
      final response = await dio.post(
        ApiEndpoints.estimarTarifa,
        data: {
          'origenLat': origenLat,
          'origenLng': origenLng,
          'destinoLat': destinoLat,
          'destinoLng': destinoLng,
        },
      );

      return EstimacionTarifaMapper.fromJson(
        response.data as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      if (e.response?.data is Map && e.response?.data['message'] != null) {
        final message = e.response!.data['message'];
        throw ServerException(
          message is List ? message.first.toString() : message.toString(),
        );
      }
      throw ServerException(AppStrings.errorServerConnection);
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }
}
