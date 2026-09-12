import '../error/failures.dart';

/// Resultado de dominio sin dependencias de librerías externas.
sealed class Resultado<T> {
  const Resultado();

  R fold<R>(
    R Function(Failure failure) onFailure,
    R Function(T value) onSuccess,
  );
}

final class Exito<T> extends Resultado<T> {
  final T valor;

  const Exito(this.valor);

  @override
  R fold<R>(
    R Function(Failure failure) onFailure,
    R Function(T value) onSuccess,
  ) {
    return onSuccess(valor);
  }
}

final class Fallo<T> extends Resultado<T> {
  final Failure failure;

  const Fallo(this.failure);

  @override
  R fold<R>(
    R Function(Failure failure) onFailure,
    R Function(T value) onSuccess,
  ) {
    return onFailure(failure);
  }
}
