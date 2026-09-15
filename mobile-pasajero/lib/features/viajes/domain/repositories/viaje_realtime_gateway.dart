import '../entities/recibo_viaje.dart';
import '../entities/conductor_asignado.dart';
import '../entities/conductor_cercano.dart';

/// Puerto de dominio para eventos en tiempo real del viaje.
abstract class ViajeRealtimeGateway {
  Future<void> conectar();

  void unirseAViaje(String viajeId);

  void observarFlota({required double latitud, required double longitud});

  void dejarDeObservarFlota();

  void escucharUbicacionConductorFlota(
    void Function(ConductorCercano conductor) callback,
  );

  void escucharConductorFueraDeFlota(void Function(String conductorId) callback);

  void escucharUbicacionActualizada(
    void Function(double latitud, double longitud) callback,
  );

  void escucharViajeAceptado(
    void Function(ConductorAsignado? conductor) callback,
  );

  void escucharConductorLlego(void Function() callback);

  void escucharViajeIniciado(void Function() callback);

  void escucharViajeCompletado(void Function(ReciboViaje recibo) callback);

  void desconectar();
}
