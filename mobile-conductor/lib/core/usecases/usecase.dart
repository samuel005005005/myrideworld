import '../tipos/resultado.dart';

abstract class UseCase<T, Params> {
  Future<Resultado<T>> call(Params params);
}

class NoParams {}

