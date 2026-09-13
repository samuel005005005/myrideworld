import '../../../../core/constants/app_strings.dart';
import '../../../../core/constants/roles.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/storage/session_storage.dart';
import '../../../../core/tipos/resultado.dart';
import '../../../auth/domain/entities/usuario.dart';
import '../../domain/entities/perfil_pasajero.dart';
import '../../domain/repositories/perfil_repository.dart';
import '../datasources/perfil_remote_datasource.dart';

class PerfilRepositoryImpl implements PerfilRepository {
  final PerfilRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;
  final SessionStorage sessionStorage;

  PerfilRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
    required this.sessionStorage,
  });

  @override
  Future<Resultado<PerfilPasajero>> obtenerPerfil() async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final perfil = await remoteDataSource.obtenerPerfil();
      await _sincronizarSesion(perfil);
      return Exito(perfil);
    } on ServerException catch (e, stack) {
      return falloDesdeError(
        contexto: 'PerfilRepositoryImpl.obtenerPerfil',
        error: e,
        stack: stack,
        failure: ServerFailure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'PerfilRepositoryImpl.obtenerPerfil',
        error: e,
        stack: stack,
        failure: const ServerFailure(AppStrings.errorUnexpected),
      );
    }
  }

  @override
  Future<Resultado<PerfilPasajero>> actualizarPerfil({
    required String nombreCompleto,
    required String telefono,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final perfil = await remoteDataSource.actualizarPerfil(
        nombreCompleto: nombreCompleto,
        telefono: telefono,
      );
      await _sincronizarSesion(perfil);
      return Exito(perfil);
    } on ServerException catch (e, stack) {
      return falloDesdeError(
        contexto: 'PerfilRepositoryImpl.actualizarPerfil',
        error: e,
        stack: stack,
        failure: ServerFailure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'PerfilRepositoryImpl.actualizarPerfil',
        error: e,
        stack: stack,
        failure: const ServerFailure(AppStrings.errorUnexpected),
      );
    }
  }

  Future<void> _sincronizarSesion(PerfilPasajero perfil) async {
    final actual = await sessionStorage.obtenerUsuario();
    await sessionStorage.actualizarUsuario(
      Usuario(
        id: perfil.id,
        nombreCompleto: perfil.nombreCompleto,
        email: perfil.email,
        telefono: perfil.telefono,
        rol: actual?.rol ?? Roles.pasajero.codigo,
      ),
    );
  }
}
