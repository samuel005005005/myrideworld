import '../../domain/entities/perfil_pasajero.dart';

class PerfilPasajeroMapper {
  static PerfilPasajero fromJson(Map<String, dynamic> json) {
    return PerfilPasajero(
      id: json['id'] as String,
      nombreCompleto: json['nombreCompleto'] as String,
      email: json['email'] as String,
      telefono: json['telefono'] as String?,
      estado: json['estado'] as String? ?? '',
    );
  }
}
