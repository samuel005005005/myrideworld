import '../../../../core/auth/validador_jwt.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/sesion_usuario.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';
import '../mappers/sesion_usuario_mapper.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<SesionUsuario>> iniciarSesion({
    required String email,
    required String password,
    required String rol,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }

    try {
      final modelo = await remoteDataSource.iniciarSesion(
        email: email,
        password: password,
        rol: rol,
      );
      await localDataSource.guardarSesion(modelo);
      return Exito(SesionUsuarioMapper.toDomain(modelo));
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.iniciarSesion',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.iniciarSesion',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorAutenticacion),
      );
    }
  }

  @override
  Future<Resultado<SesionUsuario?>> obtenerSesion() async {
    try {
      final token = await localDataSource.obtenerToken();
      if (token == null || token.isEmpty) {
        return const Exito(null);
      }

      if (!ValidadorJwt.tieneFormatoValido(token) ||
          ValidadorJwt.estaVencido(token)) {
        await localDataSource.limpiar();
        return const Exito(null);
      }

      final sesion = await localDataSource.obtenerSesion();
      if (sesion == null) {
        await localDataSource.limpiar();
        return const Exito(null);
      }
      return Exito(sesion);
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.obtenerSesion',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorTokenInvalido),
      );
    }
  }

  @override
  Future<Resultado<void>> logout() async {
    try {
      await localDataSource.limpiar();
      return const Exito(null);
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.logout',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorGenerico),
      );
    }
  }
}
