import '../../../../core/tipos/resultado.dart';
import '../entities/coordenada_conductor.dart';

abstract class UbicacionGateway {
  Future<Resultado<CoordenadaConductor>> obtenerUbicacionActual();

  Stream<CoordenadaConductor> observarUbicacion();
}
