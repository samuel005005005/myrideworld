import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/ruta_viaje.dart';
import '../repositories/routing_repository.dart';
import 'obtener_ruta_params.dart';

class ObtenerRutaUseCase implements UseCase<RutaViaje, ObtenerRutaParams> {
  final RoutingRepository repository;

  ObtenerRutaUseCase(this.repository);

  @override
  Future<Resultado<RutaViaje>> call(ObtenerRutaParams params) {
    return repository.obtenerRuta(
      origenLat: params.origenLat,
      origenLng: params.origenLng,
      destinoLat: params.destinoLat,
      destinoLng: params.destinoLng,
    );
  }
}
