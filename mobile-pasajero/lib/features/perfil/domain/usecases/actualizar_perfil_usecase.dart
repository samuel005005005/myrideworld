import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/perfil_pasajero.dart';
import '../repositories/perfil_repository.dart';
import 'actualizar_perfil_params.dart';

class ActualizarPerfilUseCase
    implements UseCase<PerfilPasajero, ActualizarPerfilParams> {
  final PerfilRepository repository;

  ActualizarPerfilUseCase(this.repository);

  @override
  Future<Resultado<PerfilPasajero>> call(ActualizarPerfilParams params) {
    return repository.actualizarPerfil(
      nombreCompleto: params.nombreCompleto,
      telefono: params.telefono,
    );
  }
}
