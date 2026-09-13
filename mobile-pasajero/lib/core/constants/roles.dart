/// Roles de autenticación alineados con el backend (`Roles` NestJS).
enum Roles {
  pasajero('PASAJERO'),
  conductor('CONDUCTOR'),
  admin('ADMIN'),
  sistema('SISTEMA');

  const Roles(this.codigo);

  /// Valor que espera la API en el body de login / JWT.
  final String codigo;
}
