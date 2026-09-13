import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../datasources/viaje_remote_datasource.dart';
import '../mappers/viaje_mapper.dart';
import '../models/viaje_model.dart';

class ViajeRepositoryImpl implements ViajeRepository {
  final ViajeRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  ViajeRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<Viaje>> aceptarViaje({
    required String viajeId,
    required String conductorId,
  }) async {
    return _resolver(
      () => remoteDataSource.aceptarViaje(
        viajeId: viajeId,
        conductorId: conductorId,
      ),
    );
  }

  @override
  Future<Resultado<Viaje>> marcarLlegada(String viajeId) async {
    return _resolver(() => remoteDataSource.marcarLlegada(viajeId));
  }

  @override
  Future<Resultado<Viaje>> iniciarViaje(String viajeId) async {
    return _resolver(() => remoteDataSource.iniciarViaje(viajeId));
  }

  @override
  Future<Resultado<Viaje>> completarViaje(String viajeId) async {
    return _resolver(() => remoteDataSource.completarViaje(viajeId));
  }

  @override
  Future<Resultado<Viaje>> rechazarViaje({required String viajeId}) async {
    return _resolver(() => remoteDataSource.rechazarViaje(viajeId));
  }

  @override
  Future<Resultado<Viaje?>> obtenerViajeActivo() async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }

    try {
      final modelo = await remoteDataSource.obtenerViajeActivo();
      if (modelo == null) {
        return const Exito(null);
      }
      return Exito(ViajeMapper.toDomain(modelo));
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'ViajeRepositoryImpl.obtenerViajeActivo',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'ViajeRepositoryImpl.obtenerViajeActivo',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorViajeActivo),
      );
    }
  }

  @override
  Future<Resultado<List<Viaje>>> listarMisViajes() async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }

    try {
      final modelos = await remoteDataSource.listarMisViajes();
      return Exito(modelos.map(ViajeMapper.toDomain).toList());
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'ViajeRepositoryImpl.listarMisViajes',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'ViajeRepositoryImpl.listarMisViajes',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorHistorial),
      );
    }
  }

  Future<Resultado<Viaje>> _resolver(
    Future<ViajeModel> Function() accion,
  ) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(Failure(AppStrings.errorSinConexion));
    }

    try {
      final modelo = await accion();
      return Exito(ViajeMapper.toDomain(modelo));
    } on AppException catch (error, stack) {
      return falloDesdeError(
        contexto: 'ViajeRepositoryImpl._resolver',
        error: error,
        stack: stack,
        failure: Failure(error.mensaje),
      );
    } catch (e, stack) {
      return falloDesdeError(
        contexto: 'ViajeRepositoryImpl._resolver',
        error: e,
        stack: stack,
        failure: const Failure(AppStrings.errorGenerico),
      );
    }
  }
}
