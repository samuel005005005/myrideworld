import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/logging/app_logger.dart';
import '../../domain/entities/contacto_soporte.dart';
import '../mappers/contacto_soporte_mapper.dart';

class SoporteRemoteDataSource {
  final Dio dio;

  SoporteRemoteDataSource({required this.dio});

  Future<ContactoSoporte> obtenerContacto() async {
    try {
      final response = await dio.get(ApiEndpoints.configuracionPublica);
      final data = response.data;
      if (data is! List) {
        throw ServerException(AppStrings.errorSoporteContacto);
      }
      return ContactoSoporteMapper.fromConfigList(data);
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null) {
        final message =
            e.response?.data['message'] ?? AppStrings.errorSoporteContacto;
        throw ServerException(
          message is List ? message.first : message.toString(),
        );
      }
      throw ServerException(AppStrings.errorServerConnection);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('SoporteRemoteDataSource.obtenerContacto', e, stack);
      throw ServerException(AppStrings.errorSoporteContacto);
    }
  }
}
