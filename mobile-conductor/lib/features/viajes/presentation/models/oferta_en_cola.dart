import '../../domain/entities/viaje.dart';

/// Oferta en la cola del conductor (lista para elegir).
class OfertaEnCola {
  final Viaje viaje;
  final String? origenTexto;
  final String? destinoTexto;

  const OfertaEnCola({
    required this.viaje,
    this.origenTexto,
    this.destinoTexto,
  });

  OfertaEnCola copyWith({
    String? origenTexto,
    String? destinoTexto,
  }) {
    return OfertaEnCola(
      viaje: viaje,
      origenTexto: origenTexto ?? this.origenTexto,
      destinoTexto: destinoTexto ?? this.destinoTexto,
    );
  }
}
