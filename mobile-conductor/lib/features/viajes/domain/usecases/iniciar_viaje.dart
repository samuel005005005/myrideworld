import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class IniciarViaje implements UseCase<Viaje, String> {
  final ViajeRepository repository;

  IniciarViaje(this.repository);

  @override
  Future<Either<Failure, Viaje>> call(String params) {
    return repository.iniciarViaje(params);
  }
}
