import '../../../../core/tipos/resultado.dart';
import '../entities/perfil_pasajero.dart';

abstract class PerfilRepository {
  Future<Resultado<PerfilPasajero>> obtenerPerfil();

  Future<Resultado<PerfilPasajero>> actualizarPerfil({
    required String nombreCompleto,
    required String telefono,
  });
}
