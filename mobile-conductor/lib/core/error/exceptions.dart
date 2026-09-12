class AppException implements Exception {
  final String mensaje;

  const AppException(this.mensaje);

  @override
  String toString() {
    return mensaje;
  }
}
