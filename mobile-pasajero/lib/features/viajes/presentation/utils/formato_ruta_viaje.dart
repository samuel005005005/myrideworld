import '../../../../core/constants/app_strings.dart';
import '../../../../core/constants/ubicaciones_turisticas.dart';
import '../../domain/entities/viaje.dart';

/// Texto legible de origen/destino para el historial (nunca coordenadas).
class FormatoRutaViaje {
  const FormatoRutaViaje._();

  static const double _toleranciaGrados = 0.002;

  static String deViaje(Viaje viaje) {
    final origen = _etiqueta(
      direccion: viaje.origenDireccion,
      latitud: viaje.origenLat,
      longitud: viaje.origenLng,
      fallback: AppStrings.historyOrigenGenerico,
    );
    final destino = _etiqueta(
      direccion: viaje.destinoDireccion,
      latitud: viaje.destinoLat,
      longitud: viaje.destinoLng,
      fallback: AppStrings.historyDestinoGenerico,
    );
    return AppStrings.formatoRutaTexto(origen, destino);
  }

  static String _etiqueta({
    required String? direccion,
    required double latitud,
    required double longitud,
    required String fallback,
  }) {
    final guardada = direccion?.trim();
    if (guardada != null &&
        guardada.isNotEmpty &&
        !_pareceCoordenada(guardada)) {
      return guardada;
    }

    final turistico = _nombreTuristicoCercano(latitud, longitud);
    if (turistico != null) {
      return turistico;
    }

    return fallback;
  }

  static bool _pareceCoordenada(String texto) {
    final t = texto.trim();
    if (t.startsWith('Lat ') || t.startsWith('lat ')) {
      return true;
    }
    return RegExp(
      r'^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$',
    ).hasMatch(t);
  }

  static String? _nombreTuristicoCercano(double latitud, double longitud) {
    for (final entrada in UbicacionesTuristicas.coordenadasPorNombre.entries) {
      final punto = entrada.value;
      if ((punto.latitude - latitud).abs() <= _toleranciaGrados &&
          (punto.longitude - longitud).abs() <= _toleranciaGrados) {
        return entrada.key;
      }
    }
    return null;
  }
}
