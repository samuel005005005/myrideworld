import '../error/failures.dart';
import '../tipos/resultado.dart';

/// Clase base para todos los casos de uso.
abstract class UseCase<T, Params> {
  Future<Resultado<T>> call(Params params);
}

/// Para use cases sin parámetros.
class NoParams {}
