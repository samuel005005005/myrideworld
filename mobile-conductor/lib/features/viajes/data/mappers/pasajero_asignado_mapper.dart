import '../../domain/entities/pasajero_asignado.dart';

class PasajeroAsignadoMapper {
  static PasajeroAsignado? fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return null;
    }

    final id = json['id'] as String?;
    final nombre = json['nombreCompleto'] as String?;
    if (id == null || nombre == null || nombre.isEmpty) {
      return null;
    }

    return PasajeroAsignado(
      id: id,
      nombreCompleto: nombre,
      telefono: json['telefono'] as String? ?? '',
    );
  }
}
