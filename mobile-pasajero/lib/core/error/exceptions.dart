class ServerException implements Exception {
  final String mensaje;
  
  ServerException([this.mensaje = 'Excepción del servidor']);
}

class CacheException implements Exception {}
