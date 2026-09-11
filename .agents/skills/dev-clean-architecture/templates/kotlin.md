# Template Kotlin - Clean Architecture (Android + Backend)

## Fuente de estructura y convenciones

[`.agents/rules/convention-kotlin.md`](../../rules/convention-kotlin.md)

Este archivo solo aporta **plantillas con placeholders**. Si hay conflicto, gana `estructuras/kotlin.md`.

## Plantilla: Entidad

```kotlin
data class {Entidad}(
    val id: String,
    val {campo}: {Tipo},
    val estado: Estado{Entidad} = Estado{Entidad}.ACTIVO
) {
    init {
        require({campo}.isNotBlank()) { "{campo} no puede estar vacío" }
    }

    fun {comportamiento}(): {Entidad} {
        check(estado != Estado{Entidad}.INACTIVO) { "Operación no permitida" }
        return copy(estado = Estado{Entidad}.INACTIVO)
    }
}
```

## Plantilla: Use Case

```kotlin
class {NombreUseCase}(
    private val repository: I{Entidad}Repository
) {
    suspend operator fun invoke(params: {Params}): Result<{Retorno}> {
        // 1. Validar
        // 2. Ejecutar lógica
        // 3. Retornar Result.success/failure
    }
}
```

## Plantilla: ViewModel

```kotlin
@HiltViewModel
class {Feature}ViewModel @Inject constructor(
    private val {useCase}: {NombreUseCase}
) : ViewModel() {

    private val _uiState = MutableStateFlow({Feature}UiState())
    val uiState: StateFlow<{Feature}UiState> = _uiState.asStateFlow()

    fun {accion}({params}) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            {useCase}({Params})
                .onSuccess { data ->
                    _uiState.update { it.copy(data = data, isLoading = false) }
                }
                .onFailure { error ->
                    _uiState.update { it.copy(error = error.message, isLoading = false) }
                }
        }
    }
}

data class {Feature}UiState(
    val data: {Tipo}? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)
```

## Plantilla: Módulo DI (Hilt)

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {
    @Provides
    @Singleton
    fun provide{Entidad}Repository(
        api: {Entidad}Api,
        dao: {Entidad}Dao
    ): I{Entidad}Repository = {Entidad}RepositoryImpl(api, dao)
}

@Module
@InstallIn(ViewModelComponent::class)
object UseCaseModule {
    @Provides
    fun provide{NombreUseCase}(
        repository: I{Entidad}Repository
    ): {NombreUseCase} = {NombreUseCase}(repository)
}
```

## Plantilla: Mappers

Los mappers aseguran que los DTOs de red (Retrofit) y las entidades de Room nunca se mezclen con el modelo de dominio.

### Flujo de transformación

```
Response DTO (API) → Entidad Domain ← Room Entity (local)
Entidad Domain → UI Model (presentation, si aplica)
```

### Mapper de Data (DTO API → Dominio)

```kotlin
// data/remote/mapper/UsuarioRemoteMapper.kt

object UsuarioRemoteMapper {
    fun toDomain(dto: UsuarioResponseDto): Usuario {
        return Usuario(
            id = dto.id,
            nombre = dto.nombre,
            email = dto.email,
            estado = EstadoUsuario.valueOf(dto.estado.uppercase()),
        )
    }

    fun toDomainList(dtos: List<UsuarioResponseDto>): List<Usuario> {
        return dtos.map { toDomain(it) }
    }

    fun toRequest(entidad: Usuario): CrearUsuarioRequestDto {
        return CrearUsuarioRequestDto(
            nombre = entidad.nombre,
            email = entidad.email,
        )
    }
}
```

### Mapper de Data (Room Entity ↔ Dominio)

```kotlin
// data/local/mapper/UsuarioLocalMapper.kt

object UsuarioLocalMapper {
    fun toDomain(entity: UsuarioEntity): Usuario {
        return Usuario(
            id = entity.id,
            nombre = entity.nombre,
            email = entity.email,
            estado = EstadoUsuario.valueOf(entity.estado),
        )
    }

    fun toEntity(dominio: Usuario): UsuarioEntity {
        return UsuarioEntity(
            id = dominio.id,
            nombre = dominio.nombre,
            email = dominio.email,
            estado = dominio.estado.name,
        )
    }

    fun toDomainList(entities: List<UsuarioEntity>): List<Usuario> {
        return entities.map { toDomain(it) }
    }
}
```

### Uso en el Repositorio

```kotlin
// data/repository/UsuarioRepositoryImpl.kt

class UsuarioRepositoryImpl(
    private val api: UsuarioApi,
    private val dao: UsuarioDao,
) : IUsuarioRepository {

    override suspend fun obtenerPorId(id: String): Usuario? {
        // Intenta local primero
        val local = dao.obtenerPorId(id)
        if (local != null) return UsuarioLocalMapper.toDomain(local)

        // Si no hay, va a red
        val remoto = api.obtenerUsuario(id)
        dao.insertar(UsuarioLocalMapper.toEntity(UsuarioRemoteMapper.toDomain(remoto)))
        return UsuarioRemoteMapper.toDomain(remoto)
    }
}
```

### Mapper de Presentación (Dominio → UI Model, opcional)

```kotlin
// presentation/ui/usuarios/mapper/UsuarioUiMapper.kt

data class UsuarioUiModel(
    val id: String,
    val nombreDisplay: String,
    val estadoLabel: String,
    val estadoColor: Color,
)

object UsuarioUiMapper {
    fun toUiModel(entidad: Usuario): UsuarioUiModel {
        return UsuarioUiModel(
            id = entidad.id,
            nombreDisplay = entidad.nombre.uppercase(),
            estadoLabel = when (entidad.estado) {
                EstadoUsuario.ACTIVO -> "Activo"
                EstadoUsuario.INACTIVO -> "Inactivo"
                EstadoUsuario.SUSPENDIDO -> "Suspendido"
            },
            estadoColor = when (entidad.estado) {
                EstadoUsuario.ACTIVO -> Color.Green
                EstadoUsuario.INACTIVO -> Color.Gray
                EstadoUsuario.SUSPENDIDO -> Color.Red
            },
        )
    }
}
```

### Reglas de Mappers

| Dirección | Ubicación | Responsable |
|-----------|-----------|-------------|
| DTO API → Entidad Domain | `data/remote/mapper/` | Repositorio |
| Room Entity ↔ Entidad Domain | `data/local/mapper/` | Repositorio |
| Entidad Domain → UI Model | `presentation/ui/{feature}/mapper/` | ViewModel (solo si UI necesita transformación) |

### Qué NO hacer

- No usar anotaciones de Kotlinx Serialization (`@Serializable`) en entidades de dominio.
- No usar anotaciones de Room (`@Entity`, `@ColumnInfo`) en entidades de dominio.
- No pasar DTOs de Retrofit directamente al ViewModel.
- No crear un mapper que conozca tanto la capa remote como la local (cada uno tiene el suyo).

## Paquetes

- Android: Hilt/Koin, Retrofit+OkHttp, Room, Coroutines+Flow, Jetpack Compose, Navigation Compose, Kotlinx Serialization
- Backend: Ktor/Spring Boot, Exposed, Kotlinx Serialization, Koin
