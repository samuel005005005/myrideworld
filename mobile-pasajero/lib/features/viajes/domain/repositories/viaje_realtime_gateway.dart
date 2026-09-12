import '../../domain/entities/recibo_viaje.dart';

/// Puerto de dominio para eventos en tiempo real del viaje.
abstract class ViajeRealtimeGateway {
  Future<void> conectar();

  void unirseAViaje(String viajeId);

  void escucharUbicacionActualizada(
    void Function(double latitud, double longitud) callback,
  );

  void escucharViajeAceptado(void Function() callback);

  void escucharConductorLlego(void Function() callback);

  void escucharViajeIniciado(void Function() callback);

  void escucharViajeCompletado(void Function(ReciboViaje recibo) callback);

  void desconectar();
}
