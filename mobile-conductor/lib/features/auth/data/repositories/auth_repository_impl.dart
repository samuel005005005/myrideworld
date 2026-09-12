import 'package:dartz/dartz.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/sesion_usuario.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';
import '../mappers/sesion_usuario_mapper.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, SesionUsuario>> iniciarSesion({
    required String email,
    required String password,
    required String rol,
  }) async {
    try {
      final modelo = await remoteDataSource.iniciarSesion(
        email: email,
        password: password,
        rol: rol,
      );
      await localDataSource.guardarSesion(modelo);
      return Right(SesionUsuarioMapper.toDomain(modelo));
    } on AppException catch (error) {
      return Left(Failure(error.mensaje));
    } catch (_) {
      return const Left(Failure(AppStrings.errorAutenticacion));
    }
  }
}
