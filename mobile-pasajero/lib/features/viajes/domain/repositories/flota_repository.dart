import '../../../../core/tipos/resultado.dart';
import '../entities/conductor_cercano.dart';

abstract class FlotaRepository {
  Future<Resultado<List<ConductorCercano>>> listarCercanos({
    required double latitud,
    required double longitud,
  });
}
