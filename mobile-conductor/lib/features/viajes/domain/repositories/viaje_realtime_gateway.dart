import '../entities/viaje.dart';

abstract class ViajeRealtimeGateway {
  Future<void> conectar();

  void identificarConductor(String conductorId);

  void unirseAViaje(String viajeId);

  void escucharEstadoConexion({
    required void Function() onConnect,
    required void Function() onDisconnect,
  });

  void escucharNuevoViaje(void Function(Viaje viaje) callback);

  void escucharOfertaCancelada(void Function(String viajeId) callback);

  void actualizarUbicacion({
    required String viajeId,
    required double latitud,
    required double longitud,
  });

  void desconectar();
}
