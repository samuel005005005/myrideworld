import '../../domain/entities/conductor_asignado.dart';

class ConductorAsignadoMapper {
  static ConductorAsignado? fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return null;
    }

    final id = json['id'] as String?;
    final nombre = json['nombreCompleto'] as String?;
    if (id == null || nombre == null || nombre.isEmpty) {
      return null;
    }

    return ConductorAsignado(
      id: id,
      nombreCompleto: nombre,
      telefono: json['telefono'] as String? ?? '',
      fotoUrl: json['fotoUrl'] as String?,
      vehiculoMarca: json['vehiculoMarca'] as String? ?? '',
      vehiculoModelo: json['vehiculoModelo'] as String? ?? '',
      vehiculoColor: json['vehiculoColor'] as String? ?? '',
      vehiculoPlaca: json['vehiculoPlaca'] as String? ?? '',
    );
  }
}
