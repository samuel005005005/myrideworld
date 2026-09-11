---
description: Convenciones Kotlin Clean Architecture (Android/Ktor)
globs: **/*.kt
alwaysApply: false
---
# Estructura Base - Kotlin con Clean Architecture

## Propósito

Define la estructura obligatoria para proyectos Kotlin (Android con MVVM/MVI y Backend con Ktor/Spring). Se activa automáticamente al trabajar con archivos `.kt`.

---

## Estructura de Proyecto - Android (MVVM + Clean Arch)

```
📁 app/src/main/java/com/empresa/proyecto/
├── 📁 domain/                             # Capa de Dominio
│   ├── 📁 model/                          # Entidades y Value Objects
│   │   ├── Usuario.kt
│   │   └── Pedido.kt
│   ├── 📁 repository/                     # Interfaces de repositorios
│   │   └── IUsuarioRepository.kt
│   ├── 📁 usecase/                        # Casos de uso
│   │   ├── ObtenerUsuarioUseCase.kt
│   │   └── CrearPedidoUseCase.kt
│   └── 📁 exception/                     # Excepciones de dominio
│       └── UsuarioNoEncontradoException.kt
│
├── 📁 data/                               # Capa de Datos (Infraestructura)
│   ├── 📁 remote/
│   │   ├── 📁 api/                        # Interfaces Retrofit/Ktor Client
│   │   │   └── UsuarioApi.kt
│   │   ├── 📁 dto/                        # DTOs de respuesta del servidor
│   │   │   └── UsuarioResponseDto.kt
│   │   └── 📁 mapper/                     # Mappers DTO → Entidad
│   │       └── UsuarioMapper.kt
│   ├── 📁 local/
│   │   ├── 📁 dao/                        # DAOs de Room
│   │   │   └── UsuarioDao.kt
│   │   ├── 📁 entity/                     # Entidades de Room
│   │   │   └── UsuarioEntity.kt
│   │   └── AppDatabase.kt
│   └── 📁 repository/                     # Implementaciones de repositorios
│       └── UsuarioRepositoryImpl.kt
│
├── 📁 presentation/                       # Capa de Presentación
│   ├── 📁 ui/
│   │   ├── 📁 usuarios/
│   │   │   ├── UsuariosScreen.kt          # Composable / Fragment
│   │   │   ├── UsuariosViewModel.kt
│   │   │   └── UsuariosUiState.kt         # Estado de UI
│   │   └── 📁 common/
│   │       └── 📁 components/             # Composables reutilizables
│   ├── 📁 navigation/
│   │   └── AppNavGraph.kt
│   └── 📁 theme/
│       └── Theme.kt
│
├── 📁 di/                                 # Inyección de Dependencias (Hilt/Koin)
│   ├── AppModule.kt
│   ├── NetworkModule.kt
│   ├── DatabaseModule.kt
│   └── RepositoryModule.kt
│
└── App.kt                                 # Application class
```

---

## Estructura de Proyecto - Backend (Ktor / Spring Boot)

```
📁 src/main/kotlin/com/empresa/proyecto/
├── 📁 domain/
│   ├── 📁 model/
│   ├── 📁 port/                           # Puertos (interfaces)
│   │   ├── 📁 input/                      # Puertos de entrada (use cases)
│   │   └── 📁 output/                     # Puertos de salida (repositorios)
│   └── 📁 service/                        # Servicios de dominio
│
├── 📁 application/
│   ├── 📁 usecase/                        # Implementación de casos de uso
│   ├── 📁 dto/                            # DTOs de aplicación
│   └── 📁 mapper/
│
├── 📁 infrastructure/
│   ├── 📁 adapter/
│   │   ├── 📁 input/                      # Adaptadores de entrada (controllers/routes)
│   │   │   └── 📁 rest/
│   │   └── 📁 output/                     # Adaptadores de salida (repos, clients)
│   │       ├── 📁 persistence/
│   │       └── 📁 httpclient/
│   └── 📁 config/                         # Configuración (DI, BD, etc.)
│
└── Application.kt                         # Entry point
```

---

## Patrones por Capa

### Dominio - Entidades

```kotlin
package com.empresa.proyecto.domain.model

data class Usuario(
    val id: String,
    val nombre: String,
    val email: String,
    val estado: EstadoUsuario = EstadoUsuario.ACTIVO
) {
    init {
        require(nombre.isNotBlank()) { "El nombre no puede estar vacío" }
        require(email.contains("@")) { "El email no es válido" }
    }

    fun desactivar(): Usuario {
        check(estado != EstadoUsuario.INACTIVO) { "El usuario ya está inactivo" }
        return copy(estado = EstadoUsuario.INACTIVO)
    }
}

enum class EstadoUsuario {
    ACTIVO, INACTIVO, SUSPENDIDO
}
```

### Dominio - Casos de Uso

```kotlin
package com.empresa.proyecto.domain.usecase

class ObtenerUsuarioUseCase(
    private val usuarioRepository: IUsuarioRepository
) {
    suspend operator fun invoke(id: String): Result<Usuario> {
        return usuarioRepository.obtenerPorId(id)
            ?.let { Result.success(it) }
            ?: Result.failure(UsuarioNoEncontradoException(id))
    }
}
```

### Dominio - Interfaz de Repositorio

```kotlin
package com.empresa.proyecto.domain.repository

interface IUsuarioRepository {
    suspend fun obtenerPorId(id: String): Usuario?
    suspend fun obtenerPorEmail(email: String): Usuario?
    suspend fun listarTodos(): List<Usuario>
    suspend fun guardar(usuario: Usuario): Usuario
    suspend fun eliminar(id: String)
    suspend fun existeEmail(email: String): Boolean
}
```

### Data - Implementación de Repositorio

```kotlin
package com.empresa.proyecto.data.repository

class UsuarioRepositoryImpl(
    private val api: UsuarioApi,
    private val dao: UsuarioDao,
    private val mapper: UsuarioMapper
) : IUsuarioRepository {

    override suspend fun obtenerPorId(id: String): Usuario? {
        // Strategy: Cache-first, luego red
        val local = dao.obtenerPorId(id)
        if (local != null) return mapper.entityToDomain(local)

        return try {
            val remoto = api.obtenerUsuario(id)
            dao.insertar(mapper.dtoToEntity(remoto))
            mapper.dtoToDomain(remoto)
        } catch (e: Exception) {
            null
        }
    }

    override suspend fun guardar(usuario: Usuario): Usuario {
        val dto = mapper.domainToRequest(usuario)
        val response = api.crearUsuario(dto)
        dao.insertar(mapper.dtoToEntity(response))
        return mapper.dtoToDomain(response)
    }

    // ... demás métodos
}
```

### Presentación - ViewModel (MVVM)

```kotlin
package com.empresa.proyecto.presentation.ui.usuarios

@HiltViewModel
class UsuariosViewModel @Inject constructor(
    private val obtenerUsuarioUseCase: ObtenerUsuarioUseCase,
    private val crearUsuarioUseCase: CrearUsuarioUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(UsuariosUiState())
    val uiState: StateFlow<UsuariosUiState> = _uiState.asStateFlow()

    fun obtenerUsuario(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            obtenerUsuarioUseCase(id)
                .onSuccess { usuario ->
                    _uiState.update { it.copy(usuario = usuario, isLoading = false) }
                }
                .onFailure { error ->
                    _uiState.update { it.copy(error = error.message, isLoading = false) }
                }
        }
    }
}

data class UsuariosUiState(
    val usuario: Usuario? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)
```

### Presentación - UI State con MVI (alternativa)

```kotlin
// Eventos (intenciones del usuario)
sealed interface UsuariosEvent {
    data class CargarUsuario(val id: String) : UsuariosEvent
    data class CrearUsuario(val nombre: String, val email: String) : UsuariosEvent
    object LimpiarError : UsuariosEvent
}

// Efectos (navegación, snackbars, one-shot)
sealed interface UsuariosEffect {
    data class MostrarMensaje(val mensaje: String) : UsuariosEffect
    data class NavegarADetalle(val id: String) : UsuariosEffect
}
```

### DI - Módulo Hilt

```kotlin
package com.empresa.proyecto.di

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideUsuarioRepository(
        api: UsuarioApi,
        dao: UsuarioDao,
        mapper: UsuarioMapper
    ): IUsuarioRepository = UsuarioRepositoryImpl(api, dao, mapper)
}

@Module
@InstallIn(ViewModelComponent::class)
object UseCaseModule {

    @Provides
    fun provideObtenerUsuarioUseCase(
        repository: IUsuarioRepository
    ): ObtenerUsuarioUseCase = ObtenerUsuarioUseCase(repository)
}
```

---

## Librerías Recomendadas

| Librería | Propósito |
|----------|-----------|
| `Hilt` / `Koin` | Inyección de dependencias |
| `Retrofit` + `OkHttp` | Cliente HTTP |
| `Room` | Base de datos local |
| `Coroutines` + `Flow` | Asincronía y flujos reactivos |
| `Jetpack Compose` | UI declarativa |
| `Navigation Compose` | Navegación |
| `Kotlinx Serialization` | Serialización JSON |
| `Ktor` (backend) | Framework web |
| `Exposed` (backend) | ORM Kotlin |

---

## Convenciones de Nomenclatura Kotlin

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Paquetes | lowercase sin guiones | `com.empresa.proyecto.domain.model` |
| Clases | PascalCase | `UsuarioRepository` |
| Interfaces | PascalCase con prefijo `I` | `IUsuarioRepository` |
| Funciones | camelCase | `obtenerPorId()` |
| Propiedades | camelCase | `nombreCompleto` |
| Constantes | UPPER_SNAKE_CASE | `MAX_REINTENTOS` |
| Sealed classes/interfaces | PascalCase | `ResultadoOperacion` |
| Use Cases | Verbo + Sustantivo + UseCase | `CrearPedidoUseCase` |
| ViewModels | Sustantivo + ViewModel | `UsuariosViewModel` |
| State | Sustantivo + UiState | `UsuariosUiState` |
| Composables | PascalCase (función) | `UsuarioCard()` |

---

## Reglas para el Agente

1. **Usa `data class`** para DTOs, estados de UI y value objects. Usa `class` regular para entidades con comportamiento complejo.
2. **Usa `sealed interface`** para representar estados, eventos y resultados con variantes finitas.
3. **Coroutines siempre**. No uses callbacks ni RxJava en código nuevo.
4. **`Flow` para streams** de datos reactivos, `suspend` para operaciones one-shot.
5. **Un UseCase por operación y por archivo**. El UseCase recibe repositorios por constructor e implementa `operator fun invoke()`.
6. **Una clase o interfaz por archivo (obligatorio)**.
   - Prohibido agrupar varios `interface`/`data class`/`class` de dominio en el mismo `.kt` (ej. `Puertos.kt`, `ModelosCobro.kt`).
   - Cada puerto e implementación = archivo propio.
   - **Excepción acotada:** `sealed interface`/`sealed class` con sus variantes en el mismo archivo (un solo tipo raíz).
7. **ViewModel no accede a la capa de datos** directamente. Siempre pasa por UseCases.
8. **Inmutabilidad por defecto**. Usa `val`, `copy()`, listas inmutables.
9. **Manejo de errores** con `Result<T>` o sealed classes, no con excepciones no controladas.
10. **Null safety**. Evita `!!`. Usa `?.`, `?:`, `let`, `require`, `check`.
11. **Compose**: un Composable = una responsabilidad. Separa state hoisting del componente visual.
