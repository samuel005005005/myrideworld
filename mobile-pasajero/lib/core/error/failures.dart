sealed class Failure {
  final String mensaje;

  const Failure(this.mensaje);
}

class ServerFailure extends Failure {
  const ServerFailure([super.mensaje = 'Error del servidor']);
}

class CacheFailure extends Failure {
  const CacheFailure([super.mensaje = 'Error de caché local']);
}

class ValidationFailure extends Failure {
  const ValidationFailure(super.mensaje);
}
