import 'package:dio/dio.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/logging/app_logger.dart';

class GeocodingRemoteDataSource {
  GeocodingRemoteDataSource({required this.dio});

  final Dio dio;

  Future<String> obtenerDireccion({
    required double latitud,
    required double longitud,
  }) async {
    try {
      final response = await dio.get<dynamic>(
        '/reverse',
        queryParameters: <String, dynamic>{
          'lat': latitud,
          'lon': longitud,
          'format': 'json',
        },
      );
      final data = response.data;
      if (data is! Map) {
        throw const AppException(AppStrings.errorObtenerDireccion);
      }
      final texto = _textoDesdeRespuesta(Map<String, dynamic>.from(data));
      if (texto == null || texto.isEmpty) {
        throw const AppException(AppStrings.errorObtenerDireccion);
      }
      return texto;
    } on DioException catch (error, stack) {
      AppLogger.error(
        'GeocodingRemoteDataSource.obtenerDireccion',
        error,
        stack,
      );
      throw const AppException(AppStrings.errorObtenerDireccion);
    } on AppException {
      rethrow;
    } catch (error, stack) {
      AppLogger.error(
        'GeocodingRemoteDataSource.obtenerDireccion',
        error,
        stack,
      );
      throw const AppException(AppStrings.errorObtenerDireccion);
    }
  }

  String? _textoDesdeRespuesta(Map<String, dynamic> data) {
    final address = data['address'];
    if (address is Map) {
      final partes = <String>[];
      for (final clave in const [
        'road',
        'neighbourhood',
        'suburb',
        'city_district',
        'city',
        'town',
        'village',
        'municipality',
        'county',
        'state',
      ]) {
        final valor = address[clave];
        if (valor is String && valor.trim().isNotEmpty) {
          final limpio = valor.trim();
          if (!partes.contains(limpio)) {
            partes.add(limpio);
          }
        }
        if (partes.length >= 3) {
          break;
        }
      }
      if (partes.isNotEmpty) {
        return partes.join(', ');
      }
    }

    final displayName = data['display_name'];
    if (displayName is String && displayName.trim().isNotEmpty) {
      final partes = displayName.split(',');
      return partes.take(3).map((p) => p.trim()).join(', ');
    }
    return null;
  }
}
