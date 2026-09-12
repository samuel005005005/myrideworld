import 'package:equatable/equatable.dart';

class SesionUsuario extends Equatable {
  final String token;
  final String userId;
  final String rol;

  const SesionUsuario({
    required this.token,
    required this.userId,
    required this.rol,
  });

  @override
  List<Object?> get props => [token, userId, rol];
}
