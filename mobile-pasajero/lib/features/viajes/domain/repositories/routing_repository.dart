import '../../../../core/tipos/resultado.dart';
import '../entities/ruta_viaje.dart';

abstract class RoutingRepository {
  Future<Resultado<RutaViaje>> obtenerRuta({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  });
}
