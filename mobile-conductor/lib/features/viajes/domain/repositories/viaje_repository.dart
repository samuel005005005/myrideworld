import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../entities/viaje.dart';

abstract class ViajeRepository {
  Future<Either<Failure, Viaje>> aceptarViaje({
    required String viajeId,
    required String conductorId,
  });

  Future<Either<Failure, Viaje>> marcarLlegada(String viajeId);

  Future<Either<Failure, Viaje>> iniciarViaje(String viajeId);

  Future<Either<Failure, Viaje>> completarViaje(String viajeId);
}
