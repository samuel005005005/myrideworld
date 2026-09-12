class Failure {
  final String mensaje;

  const Failure(this.mensaje);
}

class ValidationFailure extends Failure {
  const ValidationFailure(super.mensaje);
}
