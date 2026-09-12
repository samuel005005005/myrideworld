import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/ruta_viaje.dart';
import '../repositories/routing_repository.dart';

class ObtenerRutaUseCase implements UseCase<RutaViaje, ObtenerRutaParams> {
  final RoutingRepository repository;

  ObtenerRutaUseCase(this.repository);

  @override
  Future<Either<Failure, RutaViaje>> call(ObtenerRutaParams params) async {
    return repository.obtenerRuta(
      origenLat: params.origenLat,
      origenLng: params.origenLng,
      destinoLat: params.destinoLat,
      destinoLng: params.destinoLng,
    );
  }
}

class ObtenerRutaParams {
  final double origenLat;
  final double origenLng;
  final double destinoLat;
  final double destinoLng;

  const ObtenerRutaParams({
    required this.origenLat,
    required this.origenLng,
    required this.destinoLat,
    required this.destinoLng,
  });
}
