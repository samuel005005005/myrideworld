import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/disponibilidad_repository.dart';
import 'actualizar_disponibilidad_params.dart';

class ActualizarDisponibilidad
    implements UseCase<void, ActualizarDisponibilidadParams> {
  final DisponibilidadRepository repository;

  ActualizarDisponibilidad(this.repository);

  @override
  Future<Resultado<void>> call(ActualizarDisponibilidadParams params) {
    return repository.actualizarDisponibilidad(
      disponible: params.disponible,
    );
  }
}
