import 'package:dartz/dartz.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/usuario.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl({
    required this.remoteDataSource,
  });

  @override
  Future<Either<Failure, Usuario>> login(String email, String password, String rol) async {
    try {
      final usuarioModel = await remoteDataSource.login(email, password, rol);
      
      // Guardar token y rol en almacenamiento local
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', usuarioModel.token);
      await prefs.setString('user_rol', usuarioModel.rol);
      
      return Right(usuarioModel);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.mensaje));
    } catch (e) {
      return Left(ServerFailure('Error inesperado durante el login.'));
    }
  }
}
