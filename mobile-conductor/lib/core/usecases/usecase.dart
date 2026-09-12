import '../error/failures.dart';
import '../tipos/resultado.dart';

abstract class UseCase<Type, Params> {
  Future<Resultado<Type>> call(Params params);
}
