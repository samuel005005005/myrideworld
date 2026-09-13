import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/logging/app_logger.dart';
import '../../domain/entities/perfil_pasajero.dart';
import '../mappers/perfil_pasajero_mapper.dart';

abstract class PerfilRemoteDataSource {
  Future<PerfilPasajero> obtenerPerfil();

  Future<PerfilPasajero> actualizarPerfil({
    required String nombreCompleto,
    required String telefono,
  });
}

class PerfilRemoteDataSourceImpl implements PerfilRemoteDataSource {
  final Dio dio;

  PerfilRemoteDataSourceImpl({required this.dio});

  @override
  Future<PerfilPasajero> obtenerPerfil() async {
    try {
      final response = await dio.get(ApiEndpoints.perfilPasajero);
      return PerfilPasajeroMapper.fromJson(
        response.data as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw _mapearError(e);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('PerfilRemoteDataSourceImpl.obtenerPerfil', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }

  @override
  Future<PerfilPasajero> actualizarPerfil({
    required String nombreCompleto,
    required String telefono,
  }) async {
    try {
      final response = await dio.patch(
        ApiEndpoints.perfilPasajero,
        data: {
          'nombreCompleto': nombreCompleto,
          'telefono': telefono,
        },
      );
      return PerfilPasajeroMapper.fromJson(
        response.data as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw _mapearError(e);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('PerfilRemoteDataSourceImpl.actualizarPerfil', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }

  ServerException _mapearError(DioException e) {
    if (e.response?.data is Map && e.response?.data['message'] != null) {
      final message = e.response!.data['message'];
      return ServerException(
        message is List ? message.first.toString() : message.toString(),
      );
    }
    return ServerException(AppStrings.errorServerConnection);
  }
}
