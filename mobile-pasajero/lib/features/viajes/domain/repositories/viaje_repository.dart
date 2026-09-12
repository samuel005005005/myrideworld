import '../../../../core/tipos/resultado.dart';
import '../entities/viaje.dart';

abstract class ViajeRepository {
  Future<Resultado<Viaje>> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String idempotencyKey,
  });
}
