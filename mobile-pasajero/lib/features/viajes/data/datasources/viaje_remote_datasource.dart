import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../models/viaje_model.dart';
import '../mappers/viaje_mapper.dart';

abstract class ViajeRemoteDataSource {
  Future<ViajeModel> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String idempotencyKey,
  });
}

class ViajeRemoteDataSourceImpl implements ViajeRemoteDataSource {
  final Dio dio;

  ViajeRemoteDataSourceImpl({required this.dio});

  @override
  Future<ViajeModel> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String idempotencyKey,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final pasajeroId = prefs.getString('user_id');

      if (pasajeroId == null) {
        throw ServerException(AppStrings.errorNoSession);
      }

      final response = await dio.post(
        ApiEndpoints.solicitarViaje,
        options: Options(headers: {'Idempotency-Key': idempotencyKey}),
        data: {
          'pasajeroId': pasajeroId,
          'origenLat': origenLat,
          'origenLng': origenLng,
          'destinoLat': destinoLat,
          'destinoLng': destinoLng,
        },
      );

      return ViajeMapper.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null) {
        final message =
            e.response?.data['message'] ?? AppStrings.errorTripRequest;
        throw ServerException(
          message is List ? message.first : message.toString(),
        );
      }
      throw ServerException(AppStrings.errorServerConnection);
    } catch (e) {
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }
}
