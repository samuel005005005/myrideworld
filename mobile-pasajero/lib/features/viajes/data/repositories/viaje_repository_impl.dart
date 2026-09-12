import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../datasources/viaje_remote_datasource.dart';

class ViajeRepositoryImpl implements ViajeRepository {
  final ViajeRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  ViajeRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Resultado<Viaje>> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String idempotencyKey,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final viajeModel = await remoteDataSource.solicitarViaje(
        origenLat: origenLat,
        origenLng: origenLng,
        destinoLat: destinoLat,
        destinoLng: destinoLng,
        idempotencyKey: idempotencyKey,
      );

      return Exito(viajeModel);
    } on ServerException catch (e) {
      return Fallo(ServerFailure(e.mensaje));
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorUnexpected));
    }
  }

  @override
  Future<Resultado<List<Viaje>>> listarMisViajes() async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final modelos = await remoteDataSource.listarMisViajes();
      return Exito(List<Viaje>.from(modelos));
    } on ServerException catch (e) {
      return Fallo(ServerFailure(e.mensaje));
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorUnexpected));
    }
  }

  @override
  Future<Resultado<Viaje>> obtenerViajePorId(String viajeId) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final modelo = await remoteDataSource.obtenerViajePorId(viajeId);
      return Exito(modelo);
    } on ServerException catch (e) {
      return Fallo(ServerFailure(e.mensaje));
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorUnexpected));
    }
  }

  @override
  Future<Resultado<Viaje>> cancelarViaje({
    required String viajeId,
    String? motivo,
  }) async {
    if (!await networkInfo.estaConectado) {
      return const Fallo(NetworkFailure(AppStrings.errorSinConexion));
    }

    try {
      final modelo = await remoteDataSource.cancelarViaje(
        viajeId: viajeId,
        motivo: motivo,
      );
      return Exito(modelo);
    } on ServerException catch (e) {
      return Fallo(ServerFailure(e.mensaje));
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorUnexpected));
    }
  }
}
