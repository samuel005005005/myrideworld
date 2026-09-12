import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:mobile_pasajero/core/error/failures.dart';
import 'package:mobile_pasajero/core/tipos/resultado.dart';
import 'package:mobile_pasajero/features/auth/domain/entities/usuario.dart';
import 'package:mobile_pasajero/features/auth/domain/repositories/auth_repository.dart';
import 'package:mobile_pasajero/features/auth/domain/usecases/login_params.dart';
import 'package:mobile_pasajero/features/auth/domain/usecases/login_usecase.dart';

class _MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late _MockAuthRepository repository;
  late LoginUseCase useCase;

  setUp(() {
    repository = _MockAuthRepository();
    useCase = LoginUseCase(repository);
  });

  const usuario = Usuario(
    id: 'u1',
    nombreCompleto: 'Ana Pasajero',
    email: 'ana@test.com',
    rol: 'pasajero',
  );

  test('deberia retornar Exito cuando el repositorio autentica', () async {
    when(
      () => repository.login(any(), any(), any()),
    ).thenAnswer((_) async => const Exito(usuario));

    final resultado = await useCase(
      const LoginParams(
        email: 'ana@test.com',
        password: 'secreto',
        rol: 'pasajero',
      ),
    );

    expect(resultado, isA<Exito<Usuario>>());
    expect((resultado as Exito<Usuario>).valor, usuario);
  });

  test('deberia retornar Fallo cuando el repositorio falla', () async {
    when(
      () => repository.login(any(), any(), any()),
    ).thenAnswer((_) async => const Fallo(ServerFailure('credenciales')));

    final resultado = await useCase(
      const LoginParams(
        email: 'ana@test.com',
        password: 'mala',
        rol: 'pasajero',
      ),
    );

    expect(resultado, isA<Fallo<Usuario>>());
  });
}
