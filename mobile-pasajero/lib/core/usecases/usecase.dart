import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';

import '../error/failures.dart';

/// Clase base para todos los casos de uso.
abstract class UseCase<T, Params> {
  Future<Either<Failure, T>> call(Params params);
}

/// Para use cases sin parámetros.
class NoParams extends Equatable {
  @override
  List<Object?> get props => [];
}
