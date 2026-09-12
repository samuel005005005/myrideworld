import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../entities/ruta_viaje.dart';

abstract class RoutingRepository {
  Future<Either<Failure, RutaViaje>> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  });
}
