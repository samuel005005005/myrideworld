import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/sesion_usuario.dart';
import '../repositories/auth_repository.dart';
import 'iniciar_sesion_params.dart';

class IniciarSesion implements UseCase<SesionUsuario, IniciarSesionParams> {
  final AuthRepository repository;

  IniciarSesion(this.repository);

  @override
  Future<Either<Failure, SesionUsuario>> call(IniciarSesionParams params) {
    return repository.iniciarSesion(
      email: params.email,
      password: params.password,
      rol: params.rol,
    );
  }
}
