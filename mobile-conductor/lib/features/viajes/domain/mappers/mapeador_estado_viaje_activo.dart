import '../entities/estado_viaje_activo.dart';

class MapeadorEstadoViajeActivo {
  static EstadoViajeActivo desdeApi(String estado) {
    switch (estado) {
      case 'Llego':
        return EstadoViajeActivo.esperandoPasajero;
      case 'EnCurso':
        return EstadoViajeActivo.enViaje;
      case 'Completado':
        return EstadoViajeActivo.completado;
      case 'Asignado':
      case 'EnCamino':
      default:
        return EstadoViajeActivo.enCaminoAlPasajero;
    }
  }
}
