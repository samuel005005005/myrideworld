import '../../../../core/tipos/resultado.dart';
import '../entities/viaje.dart';

abstract class ViajeRepository {
  Future<Resultado<Viaje>> aceptarViaje({
    required String viajeId,
    required String conductorId,
  });

  Future<Resultado<Viaje>> marcarLlegada(String viajeId);

  Future<Resultado<Viaje>> iniciarViaje(String viajeId);

  Future<Resultado<Viaje>> completarViaje(String viajeId);

  Future<Resultado<Viaje>> rechazarViaje({required String viajeId});

  Future<Resultado<Viaje?>> obtenerViajeActivo();

  Future<Resultado<List<Viaje>>> listarMisViajes();
}
