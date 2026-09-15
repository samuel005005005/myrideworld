import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/conductor_cercano.dart';
import '../mappers/conductor_cercano_mapper.dart';

abstract class FlotaRemoteDataSource {
  Future<List<ConductorCercano>> listarCercanos({
    required double latitud,
    required double longitud,
  });
}

class FlotaRemoteDataSourceImpl implements FlotaRemoteDataSource {
  final Dio dio;

  FlotaRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<ConductorCercano>> listarCercanos({
    required double latitud,
    required double longitud,
  }) async {
    try {
      final response = await dio.get(
        ApiEndpoints.conductoresCercanos,
        queryParameters: {
          'lat': latitud,
          'lng': longitud,
        },
      );
      final data = response.data;
      if (data is! List) {
        return const [];
      }
      return data
          .whereType<Map>()
          .map(
            (item) => ConductorCercanoMapper.fromJson(
              Map<String, dynamic>.from(item),
            ),
          )
          .toList();
    } on DioException catch (e) {
      throw ServerException(
        e.response?.data?['message']?.toString() ??
            AppStrings.errorConductoresCercanos,
      );
    }
  }
}
