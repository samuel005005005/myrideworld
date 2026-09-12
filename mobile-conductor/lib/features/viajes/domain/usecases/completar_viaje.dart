import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class CompletarViaje implements UseCase<Viaje, String> {
  final ViajeRepository repository;

  CompletarViaje(this.repository);

  @override
  Future<Either<Failure, Viaje>> call(String params) {
    return repository.completarViaje(params);
  }
}
