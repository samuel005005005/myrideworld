import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../models/usuario_model.dart';
import '../mappers/usuario_mapper.dart';

abstract class AuthRemoteDataSource {
  Future<UsuarioModel> login(String email, String password, String rol);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl({required this.dio});

  @override
  Future<UsuarioModel> login(String email, String password, String rol) async {
    try {
      final response = await dio.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password, 'rol': rol},
      );

      return UsuarioMapper.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null) {
        final message =
            e.response?.data['message'] ?? AppStrings.errorLoginInvalid;
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
