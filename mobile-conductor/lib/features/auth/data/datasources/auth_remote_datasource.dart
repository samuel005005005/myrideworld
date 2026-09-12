import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../mappers/sesion_usuario_mapper.dart';
import '../models/sesion_usuario_model.dart';

class AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSource({required this.dio});

  Future<SesionUsuarioModel> iniciarSesion({
    required String email,
    required String password,
    required String rol,
  }) async {
    try {
      final respuesta = await dio.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password, 'rol': rol},
      );

      return SesionUsuarioMapper.fromApiResponse(
        Map<String, dynamic>.from(respuesta.data as Map),
        email: email,
      );
    } on DioException catch (error) {
      final data = error.response?.data;
      if (data is Map && data['message'] != null) {
        final mensaje = data['message'];
        throw AppException(
          mensaje is List ? mensaje.first.toString() : mensaje.toString(),
        );
      }
      throw const AppException(AppStrings.errorAutenticacion);
    } on AppException {
      rethrow;
    } catch (_) {
      throw const AppException(AppStrings.errorAutenticacion);
    }
  }
}
