import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../entities/sesion_usuario.dart';

abstract class AuthRepository {
  Future<Either<Failure, SesionUsuario>> iniciarSesion({
    required String email,
    required String password,
    required String rol,
  });
}
