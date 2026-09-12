import '../../../../core/tipos/resultado.dart';
import '../entities/coordenada.dart';

abstract class UbicacionGateway {
  Future<Resultado<Coordenada>> obtenerUbicacionActual();
}
