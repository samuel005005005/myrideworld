import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
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
  Future<Resultado<SesionUsuario>> iniciarSesion({
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
      return Exito(SesionUsuarioMapper.toDomain(modelo));
    } on AppException catch (error) {
      return Fallo(Failure(error.mensaje));
    } catch (_) {
      return const Fallo(Failure(AppStrings.errorAutenticacion));
    }
  }
}
