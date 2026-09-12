import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/usuario.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Resultado<Usuario>> login(
    String email,
    String password,
    String rol,
  ) async {
    try {
      final usuarioModel = await remoteDataSource.login(email, password, rol);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', usuarioModel.token);
      await prefs.setString('user_rol', usuarioModel.rol);
      await prefs.setString('user_id', usuarioModel.id);

      return Exito(usuarioModel);
    } on ServerException catch (e) {
      return Fallo(ServerFailure(e.mensaje));
    } catch (e) {
      return const Fallo(ServerFailure(AppStrings.errorUnexpected));
    }
  }
}
