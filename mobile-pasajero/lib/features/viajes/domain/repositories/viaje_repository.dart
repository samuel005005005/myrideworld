import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/viaje.dart';

abstract class ViajeRepository {
  Future<Either<Failure, Viaje>> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String idempotencyKey,
  });
}
