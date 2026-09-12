import 'package:dartz/dartz.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../datasources/viaje_remote_datasource.dart';

class ViajeRepositoryImpl implements ViajeRepository {
  final ViajeRemoteDataSource remoteDataSource;

  ViajeRepositoryImpl({
    required this.remoteDataSource,
  });

  @override
  Future<Either<Failure, Viaje>> solicitarViaje({
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
      
      return Right(viajeModel);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.mensaje));
    } catch (e) {
      return Left(ServerFailure(AppStrings.errorUnexpected));
    }
  }
}
