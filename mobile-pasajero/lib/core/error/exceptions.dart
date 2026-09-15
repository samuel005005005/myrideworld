class ServerException implements Exception {
  final String mensaje;

  ServerException([this.mensaje = 'Excepción del servidor']);

  @override
  String toString() => mensaje;
}

class CacheException implements Exception {}
