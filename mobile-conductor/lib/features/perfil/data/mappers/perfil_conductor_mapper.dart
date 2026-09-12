import '../../domain/entities/perfil_conductor.dart';

class PerfilConductorMapper {
  static PerfilConductor fromJson(Map<String, dynamic> json) {
    final vehiculo = json['vehiculo'] as Map<String, dynamic>? ?? const {};
    return PerfilConductor(
      id: json['id'] as String,
      nombreCompleto: json['nombreCompleto'] as String,
      email: json['email'] as String,
      telefono: json['telefono'] as String? ?? '',
      estadoAprobacion: json['estadoAprobacion'] as String? ?? '',
      estadoDisponibilidad: json['estadoDisponibilidad'] as String? ?? '',
      vehiculoMarca: vehiculo['marca'] as String? ?? '',
      vehiculoModelo: vehiculo['modelo'] as String? ?? '',
      vehiculoColor: vehiculo['color'] as String? ?? '',
      vehiculoPlaca: vehiculo['placa'] as String? ?? '',
    );
  }
}
