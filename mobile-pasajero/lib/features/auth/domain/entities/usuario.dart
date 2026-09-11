import 'package:equatable/equatable.dart';

class Usuario extends Equatable {
  final String id;
  final String nombreCompleto;
  final String email;
  final String? telefono;
  final String rol;
  final String token;

  const Usuario({
    required this.id,
    required this.nombreCompleto,
    required this.email,
    this.telefono,
    required this.rol,
    required this.token,
  });

  @override
  List<Object?> get props => [id, nombreCompleto, email, telefono, rol, token];
}
