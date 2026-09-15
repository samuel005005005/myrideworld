import '../../../../core/constants/app_strings.dart';
import '../../../../core/auth/validador_jwt.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/storage/session_storage.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/usuario.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final SessionStorage sessionStorage;
  final NetworkInfo networkInfo;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.sessionStorage,
    required this.networkInfo,
  });

  @override
  Future<Resultado<Usuario>> login(
    String email,
    String password,
    String rol,
  ) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final credenciales = await remoteDataSource.login(email, password, rol);
      await sessionStorage.guardarSesion(
        token: credenciales.accessToken,
        usuario: credenciales.usuario,
      );
      return Exito(credenciales.usuario);
    } on ServerException catch (e, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.login',
        error: e,
        stack: stack,
        failure: ServerFailure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.login',
        error: e,
        stack: stack,
        failure: const ServerFailure(AppStrings.errorUnexpected),
      );
    }
  }

  @override
  Future<Resultado<Usuario?>> obtenerSesion() async {
    try {
      final token = await sessionStorage.obtenerToken();
      if (token == null || token.isEmpty) {
        return const Exito(null);
      }

      if (!ValidadorJwt.tieneFormatoValido(token) ||
          ValidadorJwt.estaVencido(token)) {
        await sessionStorage.limpiar();
        return const Exito(null);
      }

      final usuario = await sessionStorage.obtenerUsuario();
      if (usuario == null) {
        await sessionStorage.limpiar();
        return const Exito(null);
      }

      return Exito(usuario);
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.obtenerSesion',
        error: e,
        stack: stack,
        failure: const CacheFailure(),
      );
    }
  }

  @override
  Future<Resultado<void>> logout() async {
    try {
      await sessionStorage.limpiar();
      return const Exito(null);
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'AuthRepositoryImpl.logout',
        error: e,
        stack: stack,
        failure: const CacheFailure(),
      );
    }
  }
}
