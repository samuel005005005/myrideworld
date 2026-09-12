import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/viaje.dart';
import '../repositories/viaje_repository.dart';

class SolicitarViajeUseCase implements UseCase<Viaje, SolicitarViajeParams> {
  final ViajeRepository repository;

  SolicitarViajeUseCase(this.repository);

  @override
  Future<Either<Failure, Viaje>> call(SolicitarViajeParams params) async {
    return await repository.solicitarViaje(
      origenLat: params.origenLat,
      origenLng: params.origenLng,
      destinoLat: params.destinoLat,
      destinoLng: params.destinoLng,
      idempotencyKey: params.idempotencyKey,
    );
  }
}

class SolicitarViajeParams extends Equatable {
  final double origenLat;
  final double origenLng;
  final double destinoLat;
  final double destinoLng;
  final String idempotencyKey;

  const SolicitarViajeParams({
    required this.origenLat,
    required this.origenLng,
    required this.destinoLat,
    required this.destinoLng,
    required this.idempotencyKey,
  });

  @override
  List<Object?> get props => [
        origenLat,
        origenLng,
        destinoLat,
        destinoLng,
        idempotencyKey,
      ];
}
