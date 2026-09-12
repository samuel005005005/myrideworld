import '../../../../core/tipos/resultado.dart';
import '../entities/perfil_conductor.dart';

abstract class PerfilRepository {
  Future<Resultado<PerfilConductor>> obtenerPerfil();

  Future<Resultado<PerfilConductor>> actualizarPerfil({
    required String nombreCompleto,
    required String telefono,
    required String vehiculoMarca,
    required String vehiculoModelo,
    required String vehiculoColor,
    required String vehiculoPlaca,
  });
}
