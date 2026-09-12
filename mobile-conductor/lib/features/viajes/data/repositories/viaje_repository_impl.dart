import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../datasources/viaje_remote_datasource.dart';
import '../mappers/viaje_mapper.dart';
import '../models/viaje_model.dart';

class ViajeRepositoryImpl implements ViajeRepository {
  final ViajeRemoteDataSource remoteDataSource;

  ViajeRepositoryImpl({required this.remoteDataSource});

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

  Future<Resultado<Viaje>> _resolver(
    Future<ViajeModel> Function() accion,
  ) async {
    try {
      final modelo = await accion();
      return Exito(ViajeMapper.toDomain(modelo));
    } on AppException catch (error) {
      return Fallo(Failure(error.mensaje));
    }
  }
}
