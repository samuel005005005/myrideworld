import 'package:dartz/dartz.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../datasources/viaje_remote_datasource.dart';
import '../mappers/viaje_mapper.dart';
import '../models/viaje_model.dart';

class ViajeRepositoryImpl implements ViajeRepository {
  final ViajeRemoteDataSource remoteDataSource;

  ViajeRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, Viaje>> aceptarViaje({
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
  Future<Either<Failure, Viaje>> marcarLlegada(String viajeId) async {
    return _resolver(() => remoteDataSource.marcarLlegada(viajeId));
  }

  @override
  Future<Either<Failure, Viaje>> iniciarViaje(String viajeId) async {
    return _resolver(() => remoteDataSource.iniciarViaje(viajeId));
  }

  @override
  Future<Either<Failure, Viaje>> completarViaje(String viajeId) async {
    return _resolver(() => remoteDataSource.completarViaje(viajeId));
  }

  Future<Either<Failure, Viaje>> _resolver(
    Future<ViajeModel> Function() accion,
  ) async {
    try {
      final modelo = await accion();
      return Right(ViajeMapper.toDomain(modelo));
    } on AppException catch (error) {
      return Left(Failure(error.mensaje));
    }
  }
}
