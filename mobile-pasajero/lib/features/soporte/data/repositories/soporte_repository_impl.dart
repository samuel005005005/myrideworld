import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/contacto_soporte.dart';
import '../../domain/repositories/soporte_repository.dart';
import '../datasources/soporte_remote_datasource.dart';

class SoporteRepositoryImpl implements SoporteRepository {
  final SoporteRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  SoporteRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<ContactoSoporte>> obtenerContacto() async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final contacto = await remoteDataSource.obtenerContacto();
      return Exito(contacto);
    } on ServerException catch (e, stack) {
      return falloDesdeError(
        contexto: 'SoporteRepositoryImpl.obtenerContacto',
        error: e,
        stack: stack,
        failure: ServerFailure(e.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'SoporteRepositoryImpl.obtenerContacto',
        error: e,
        stack: stack,
        failure: const ServerFailure(AppStrings.errorUnexpected),
      );
    }
  }
}
