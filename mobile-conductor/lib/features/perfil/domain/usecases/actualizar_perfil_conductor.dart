import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/perfil_conductor.dart';
import '../repositories/perfil_repository.dart';
import 'actualizar_perfil_conductor_params.dart';

class ActualizarPerfilConductor
    implements UseCase<PerfilConductor, ActualizarPerfilConductorParams> {
  final PerfilRepository repository;

  ActualizarPerfilConductor(this.repository);

  @override
  Future<Resultado<PerfilConductor>> call(
    ActualizarPerfilConductorParams params,
  ) {
    return repository.actualizarPerfil(
      nombreCompleto: params.nombreCompleto,
      telefono: params.telefono,
      vehiculoMarca: params.vehiculoMarca,
      vehiculoModelo: params.vehiculoModelo,
      vehiculoColor: params.vehiculoColor,
      vehiculoPlaca: params.vehiculoPlaca,
    );
  }
}
