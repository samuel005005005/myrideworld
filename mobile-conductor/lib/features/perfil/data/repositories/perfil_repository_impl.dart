import '../../../../core/constants/app_strings.dart';
import '../../../../core/constants/roles.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/storage/session_storage.dart';
import '../../../../core/tipos/resultado.dart';
import '../../../auth/domain/entities/sesion_usuario.dart';
import '../../domain/entities/perfil_conductor.dart';
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
  Future<Resultado<PerfilConductor>> obtenerPerfil() async {
    return _resolver(() => remoteDataSource.obtenerPerfil());
  }

  @override
  Future<Resultado<PerfilConductor>> actualizarPerfil({
    required String nombreCompleto,
    required String telefono,
    required String vehiculoMarca,
    required String vehiculoModelo,
    required String vehiculoColor,
    required String vehiculoPlaca,
  }) async {
    return _resolver(
      () => remoteDataSource.actualizarPerfil(
        nombreCompleto: nombreCompleto,
        telefono: telefono,
        vehiculoMarca: vehiculoMarca,
        vehiculoModelo: vehiculoModelo,
        vehiculoColor: vehiculoColor,
        vehiculoPlaca: vehiculoPlaca,
      ),
    );
  }

  Future<Resultado<PerfilConductor>> _resolver(
    Future<PerfilConductor> Function() accion,
  ) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }

    try {
      final perfil = await accion();
      final actual = await sessionStorage.obtenerSesion();
      await sessionStorage.actualizarSesion(
        SesionUsuario(
          userId: perfil.id,
          rol: actual?.rol ?? Roles.conductor.codigo,
          email: perfil.email,
          nombreCompleto: perfil.nombreCompleto,
        ),
      );
      return Exito(perfil);
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'PerfilRepositoryImpl._resolver',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'PerfilRepositoryImpl._resolver',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorGenerico),
      );
    }
  }
}
