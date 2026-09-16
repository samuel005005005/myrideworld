import '../entities/viaje.dart';

abstract class ViajeRealtimeGateway {
  Future<void> conectar();

  void identificarConductor(String conductorId);

  void unirseAViaje(String viajeId);

  void salirDeViaje(String viajeId);

  void escucharEstadoConexion({
    required void Function() onConnect,
    required void Function() onDisconnect,
  });

  void escucharNuevoViaje(void Function(Viaje viaje) callback);

  void escucharOfertaCancelada(void Function(String viajeId) callback);

  void escucharViajeCancelado(void Function(String viajeId) callback);

  void escucharEstadoViaje(void Function(Viaje viaje) callback);

  void escucharSesionReemplazada(void Function(String motivo) callback);

  void actualizarUbicacion({
    required String viajeId,
    required double latitud,
    required double longitud,
  });

  void publicarUbicacionFlota({
    required double latitud,
    required double longitud,
  });

  void salirDeFlota();

  void desconectar();
}
