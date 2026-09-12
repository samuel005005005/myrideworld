import '../../../../core/tipos/resultado.dart';
import '../entities/estimacion_tarifa.dart';

abstract class TarifaRepository {
  Future<Resultado<EstimacionTarifa>> estimar({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  });
}
