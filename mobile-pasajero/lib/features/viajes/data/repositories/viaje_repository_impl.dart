import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../datasources/viaje_remote_datasource.dart';

class ViajeRepositoryImpl implements ViajeRepository {
  final ViajeRemoteDataSource remoteDataSource;

  ViajeRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Resultado<Viaje>> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String idempotencyKey,
  }) async {
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
    } catch (e) {
      return const Fallo(ServerFailure(AppStrings.errorUnexpected));
    }
  }
}
