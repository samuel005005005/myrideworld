import '../../../../core/tipos/resultado.dart';

abstract class DisponibilidadRepository {
  Future<Resultado<void>> actualizarDisponibilidad({
    required bool disponible,
  });
}
