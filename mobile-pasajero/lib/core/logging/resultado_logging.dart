import '../error/failures.dart';
import '../tipos/resultado.dart';
import 'app_logger.dart';

/// Extensión de presentación/infra: loguea fallos al hacer fold.
extension ResultadoLoggingX<T> on Resultado<T> {
  R foldLogged<R>(
    String contexto,
    R Function(Failure failure) onFailure,
    R Function(T value) onSuccess,
  ) {
    return fold(
      (failure) {
        AppLogger.warning(contexto, failure.mensaje, StackTrace.current);
        return onFailure(failure);
      },
      onSuccess,
    );
  }
}

/// Convierte una excepción atrapada en [Fallo] y la registra en terminal.
Resultado<T> falloDesdeError<T>({
  required String contexto,
  required Object error,
  required StackTrace stack,
  required Failure failure,
}) {
  AppLogger.error(contexto, error, stack);
  return Fallo(failure);
}
