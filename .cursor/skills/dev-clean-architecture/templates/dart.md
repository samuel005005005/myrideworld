# Template Dart/Flutter - Clean Architecture + Riverpod

## Fuente de estructura y convenciones

[`.cursor/rules/convention-dart.mdc`](../../rules/convention-dart.md)

Este archivo solo aporta **plantillas con placeholders**. Si hay conflicto (p. ej. mappers vs Model extends Entity), gana `estructuras/dart.md`.

## Plantilla: Entidad

```dart
class {Entidad} extends Equatable {
  final String id;
  // campos...

  const {Entidad}({required this.id, /* ... */});

  {Entidad} copyWith({/* campos opcionales */}) {
    return {Entidad}(/* ... */);
  }

  @override
  List<Object?> get props => [id, /* ... */];
}
```

## Plantilla: Use Case

```dart
class {NombreUseCase} implements UseCase<{Retorno}, {Params}> {
  final {Entidad}Repository repository;

  {NombreUseCase}(this.repository);

  @override
  Future<Either<Failure, {Retorno}>> call({Params} params) {
    return repository.{metodo}(params.{campo});
  }
}

class {Params} extends Equatable {
  final {tipo} {campo};
  const {Params}({required this.{campo}});

  @override
  List<Object?> get props => [{campo}];
}
```

## Plantilla: Provider + Controller (Riverpod)

```dart
// Providers de DI
final {entidad}RepositoryProvider = Provider<{Entidad}Repository>((ref) {
  return {Entidad}RepositoryImpl(
    remoteDataSource: ref.watch({entidad}RemoteDataSourceProvider),
    localDataSource: ref.watch({entidad}LocalDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final {nombreUseCase}Provider = Provider<{NombreUseCase}>((ref) {
  return {NombreUseCase}(ref.watch({entidad}RepositoryProvider));
});

// Controller
final {feature}ControllerProvider =
    AsyncNotifierProvider<{Feature}Controller, List<{Entidad}>>(
  {Feature}Controller.new,
);

class {Feature}Controller extends AsyncNotifier<List<{Entidad}>> {
  @override
  Future<List<{Entidad}>> build() async {
    // cargar datos iniciales
  }

  Future<void> {accion}({params}) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      // ejecutar use case
    });
  }
}
```

## Plantilla: Page (ConsumerWidget)

```dart
class {Feature}Page extends ConsumerWidget {
  const {Feature}Page({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncData = ref.watch({feature}ControllerProvider);

    return Scaffold(
      body: asyncData.when(
        loading: () => const LoadingWidget(),
        error: (error, _) => ErrorWidget(mensaje: error.toString()),
        data: (datos) => /* UI con los datos */,
      ),
    );
  }
}
```

## Plantilla: Mappers

Los mappers mantienen la separación entre capas. El Model (data) nunca se expone a presentación, y la entidad de dominio nunca conoce JSON ni la BD.

### Flujo de transformación

```
JSON (API) → Model (data) → Entidad (domain)
Entidad (domain) → Model (data) → JSON (API)
Entidad (domain) → DTO/Estado (presentation)
```

### Mapper en la capa Data (Model ↔ Entidad)

```dart
// features/usuarios/data/mappers/usuario_mapper.dart

import '../../domain/entities/usuario.dart';
import '../models/usuario_model.dart';

class UsuarioMapper {
  /// Model (datos remotos/locales) → Entidad de dominio
  static Usuario toDomain(UsuarioModel model) {
    return Usuario(
      id: model.id,
      nombre: model.nombre,
      email: model.email,
      estado: model.estado,
      fechaCreacion: model.fechaCreacion,
    );
  }

  /// Entidad de dominio → Model (para persistir o enviar)
  static UsuarioModel toModel(Usuario entidad) {
    return UsuarioModel(
      id: entidad.id,
      nombre: entidad.nombre,
      email: entidad.email,
      estado: entidad.estado,
      fechaCreacion: entidad.fechaCreacion,
    );
  }

  /// Lista de Models → Lista de Entidades
  static List<Usuario> toDomainList(List<UsuarioModel> models) {
    return models.map(toDomain).toList();
  }
}
```

### Uso en el Repositorio

```dart
// features/usuarios/data/repositories/usuario_repository_impl.dart

@override
Future<Either<Failure, Usuario>> obtenerPorId(String id) async {
  try {
    final model = await remoteDataSource.obtenerPorId(id);
    final entidad = UsuarioMapper.toDomain(model);
    return Right(entidad);
  } on ServerException catch (e) {
    return Left(ServerFailure(e.mensaje));
  }
}
```

### Mapper en Presentación (Entidad → UI Model, si aplica)

```dart
// features/usuarios/presentation/mappers/usuario_ui_mapper.dart

import '../../domain/entities/usuario.dart';

class UsuarioUiModel {
  final String id;
  final String nombreDisplay;
  final String estadoLabel;
  final Color estadoColor;

  const UsuarioUiModel({
    required this.id,
    required this.nombreDisplay,
    required this.estadoLabel,
    required this.estadoColor,
  });

  factory UsuarioUiModel.fromEntity(Usuario entidad) {
    return UsuarioUiModel(
      id: entidad.id,
      nombreDisplay: entidad.nombre.toUpperCase(),
      estadoLabel: _mapEstadoLabel(entidad.estado),
      estadoColor: _mapEstadoColor(entidad.estado),
    );
  }

  static String _mapEstadoLabel(EstadoUsuario estado) => switch (estado) {
    EstadoUsuario.activo => 'Activo',
    EstadoUsuario.inactivo => 'Inactivo',
    EstadoUsuario.suspendido => 'Suspendido',
  };

  static Color _mapEstadoColor(EstadoUsuario estado) => switch (estado) {
    EstadoUsuario.activo => Colors.green,
    EstadoUsuario.inactivo => Colors.grey,
    EstadoUsuario.suspendido => Colors.red,
  };
}
```

### Reglas de Mappers

| Dirección | Ubicación | Responsable |
|-----------|-----------|-------------|
| Model (JSON) → Entidad | `data/mappers/` | Repositorio (al retornar datos) |
| Entidad → Model (JSON) | `data/mappers/` | Repositorio (al enviar datos) |
| Entidad → UI Model | `presentation/mappers/` | Controller o Widget (si necesita transformación visual) |
| Request UI → Params UseCase | Controller | Directo (no necesita mapper si es simple) |

### Qué NO hacer

- No poner `fromJson`/`toJson` en la entidad de dominio.
- No pasar Models directamente a los widgets.
- No importar clases de `data/` en `presentation/`.
- No crear mappers circulares (que conozcan ambas direcciones entre capas no adyacentes).

## Paquetes

- flutter_riverpod, riverpod_annotation, dartz, freezed, equatable, dio, go_router, hive/isar, mockito/mocktail
