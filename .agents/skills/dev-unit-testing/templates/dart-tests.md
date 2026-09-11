# Template Tests - Dart/Flutter (flutter_test + mocktail)

## Fuente de ubicación

Estructura del proyecto: [`.agents/rules/convention-dart.md`](../../rules/convention-dart.md)  
Convenciones de tests: skill `unit-testing`.

## Estructura

```
test/
└── features/
    └── usuarios/
        ├── domain/
        │   └── usecases/
        │       └── obtener_usuario_test.dart
        ├── data/
        │   └── repositories/
        │       └── usuario_repository_impl_test.dart
        └── presentation/
            └── controllers/
                └── usuarios_controller_test.dart
```

## Plantilla: Test de Use Case

```dart
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

// Mocks
class MockUsuarioRepository extends Mock implements UsuarioRepository {}

void main() {
  late ObtenerUsuario sut;
  late MockUsuarioRepository mockRepository;

  setUp(() {
    mockRepository = MockUsuarioRepository();
    sut = ObtenerUsuario(mockRepository);
  });

  final tUsuario = Usuario(
    id: '123',
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    fechaCreacion: DateTime(2024, 1, 1),
  );

  group('ObtenerUsuario', () {
    test('DebeRetornarUsuario_CuandoIdExiste', () async {
      // Arrange
      when(() => mockRepository.obtenerPorId('123'))
          .thenAnswer((_) async => Right(tUsuario));

      // Act
      final resultado = await sut(const ObtenerUsuarioParams(id: '123'));

      // Assert
      expect(resultado, Right(tUsuario));
      verify(() => mockRepository.obtenerPorId('123')).called(1);
      verifyNoMoreInteractions(mockRepository);
    });

    test('DebeRetornarFailure_CuandoIdNoExiste', () async {
      // Arrange
      when(() => mockRepository.obtenerPorId('999'))
          .thenAnswer((_) async => const Left(ServerFailure('No encontrado')));

      // Act
      final resultado = await sut(const ObtenerUsuarioParams(id: '999'));

      // Assert
      expect(resultado, const Left(ServerFailure('No encontrado')));
    });
  });
}
```

## Plantilla: Test de Repositorio

```dart
class MockRemoteDataSource extends Mock implements UsuarioRemoteDataSource {}
class MockLocalDataSource extends Mock implements UsuarioLocalDataSource {}
class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  late UsuarioRepositoryImpl sut;
  late MockRemoteDataSource mockRemote;
  late MockLocalDataSource mockLocal;
  late MockNetworkInfo mockNetwork;

  setUp(() {
    mockRemote = MockRemoteDataSource();
    mockLocal = MockLocalDataSource();
    mockNetwork = MockNetworkInfo();
    sut = UsuarioRepositoryImpl(
      remoteDataSource: mockRemote,
      localDataSource: mockLocal,
      networkInfo: mockNetwork,
    );
  });

  group('obtenerPorId', () {
    test('DebeRetornarDatosRemotos_CuandoHayConexion', () async {
      // Arrange
      when(() => mockNetwork.isConnected).thenAnswer((_) async => true);
      when(() => mockRemote.obtenerPorId('123'))
          .thenAnswer((_) async => tUsuarioModel);
      when(() => mockLocal.cachearUsuario(tUsuarioModel))
          .thenAnswer((_) async {});

      // Act
      final resultado = await sut.obtenerPorId('123');

      // Assert
      expect(resultado, Right(tUsuarioModel));
      verify(() => mockLocal.cachearUsuario(tUsuarioModel)).called(1);
    });

    test('DebeRetornarCache_CuandoNoHayConexion', () async {
      // Arrange
      when(() => mockNetwork.isConnected).thenAnswer((_) async => false);
      when(() => mockLocal.obtenerUsuario('123'))
          .thenAnswer((_) async => tUsuarioModel);

      // Act
      final resultado = await sut.obtenerPorId('123');

      // Assert
      expect(resultado, Right(tUsuarioModel));
      verifyZeroInteractions(mockRemote);
    });
  });
}
```

## Plantilla: Test de Controller (Riverpod)

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockListarUsuarios extends Mock implements ListarUsuarios {}
class MockCrearUsuario extends Mock implements CrearUsuario {}

void main() {
  late ProviderContainer container;
  late MockListarUsuarios mockListar;
  late MockCrearUsuario mockCrear;

  setUp(() {
    mockListar = MockListarUsuarios();
    mockCrear = MockCrearUsuario();

    container = ProviderContainer(
      overrides: [
        listarUsuariosUseCaseProvider.overrideWithValue(mockListar),
        crearUsuarioUseCaseProvider.overrideWithValue(mockCrear),
      ],
    );
  });

  tearDown(() => container.dispose());

  test('DebeCargarListaDeUsuarios_CuandoSeInicializa', () async {
    // Arrange
    when(() => mockListar(NoParams()))
        .thenAnswer((_) async => Right([tUsuario]));

    // Act
    final controller = container.read(usuariosControllerProvider.future);

    // Assert
    final result = await controller;
    expect(result, [tUsuario]);
  });

  test('DebeLanzarExcepcion_CuandoFallaLaCarga', () async {
    // Arrange
    when(() => mockListar(NoParams()))
        .thenAnswer((_) async => const Left(ServerFailure()));

    // Act & Assert
    expect(
      () => container.read(usuariosControllerProvider.future),
      throwsException,
    );
  });
}
```

## Paquetes de Test

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  mocktail: ^1.0.0
  bloc_test: ^9.0.0  # solo si usas bloc en algún lugar
```
