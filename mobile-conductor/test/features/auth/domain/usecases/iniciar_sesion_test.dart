import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:mobile_conductor/core/error/failures.dart';
import 'package:mobile_conductor/core/tipos/resultado.dart';
import 'package:mobile_conductor/features/auth/domain/entities/sesion_usuario.dart';
import 'package:mobile_conductor/features/auth/domain/repositories/auth_repository.dart';
import 'package:mobile_conductor/features/auth/domain/usecases/iniciar_sesion.dart';
import 'package:mobile_conductor/features/auth/domain/usecases/iniciar_sesion_params.dart';

class _MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late _MockAuthRepository repository;
  late IniciarSesion useCase;

  setUp(() {
    repository = _MockAuthRepository();
    useCase = IniciarSesion(repository);
  });

  const sesion = SesionUsuario(userId: 'c1', rol: 'CONDUCTOR');

  test('deberia retornar Exito cuando el repositorio autentica', () async {
    when(
      () => repository.iniciarSesion(
        email: any(named: 'email'),
        password: any(named: 'password'),
        rol: any(named: 'rol'),
      ),
    ).thenAnswer((_) async => const Exito(sesion));

    final resultado = await useCase(
      const IniciarSesionParams(
        email: 'conductor@test.com',
        password: 'secreto',
        rol: 'CONDUCTOR',
      ),
    );

    expect(resultado, isA<Exito<SesionUsuario>>());
  });

  test('deberia retornar Fallo cuando el repositorio falla', () async {
    when(
      () => repository.iniciarSesion(
        email: any(named: 'email'),
        password: any(named: 'password'),
        rol: any(named: 'rol'),
      ),
    ).thenAnswer((_) async => const Fallo(Failure('error')));

    final resultado = await useCase(
      const IniciarSesionParams(
        email: 'conductor@test.com',
        password: 'mala',
        rol: 'CONDUCTOR',
      ),
    );

    expect(resultado, isA<Fallo<SesionUsuario>>());
  });
}
