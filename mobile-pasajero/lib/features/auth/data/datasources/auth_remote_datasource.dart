import 'package:dio/dio.dart';

import '../../../../core/error/exceptions.dart';
import '../models/usuario_model.dart';

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
        '/api/auth/login',
        data: {
          'email': email,
          'password': password,
          'rol': rol,
        },
      );
      
      return UsuarioModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null) {
        final message = e.response?.data['message'] ?? 'Credenciales inválidas o error en login';
        throw ServerException(message is List ? message.first : message.toString());
      }
      throw ServerException('Error de conexión con el servidor');
    } catch (e) {
      throw ServerException('Error inesperado: $e');
    }
  }
}
