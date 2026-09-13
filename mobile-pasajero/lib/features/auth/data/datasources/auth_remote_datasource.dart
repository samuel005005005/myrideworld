import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../models/credenciales_auth_model.dart';
import '../mappers/usuario_mapper.dart';

abstract class AuthRemoteDataSource {
  Future<CredencialesAuthModel> login(String email, String password, String rol);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl({required this.dio});

  @override
  Future<CredencialesAuthModel> login(
    String email,
    String password,
    String rol,
  ) async {
    try {
      final response = await dio.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password, 'rol': rol},
      );

      final data = response.data;
      if (data is! Map) {
        throw ServerException(AppStrings.errorRespuestaLogin);
      }

      return UsuarioMapper.fromApiResponse(
        Map<String, dynamic>.from(data),
        email: email,
        rolSolicitado: rol,
      );
    } on DioException catch (e, stack) {
      if (kDebugMode) {
        debugPrint('[MyRide Auth] DioException en login: $e\n$stack');
      }
      if (e.response != null && e.response?.data != null) {
        final message =
            e.response?.data['message'] ?? AppStrings.errorLoginInvalid;
        throw ServerException(
          message is List ? message.first.toString() : message.toString(),
        );
      }
      throw ServerException(AppStrings.errorServerConnection);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      if (kDebugMode) {
        debugPrint('[MyRide Auth] Error parseando login: $e\n$stack');
      }
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }
}
