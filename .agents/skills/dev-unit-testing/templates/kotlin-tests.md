# Template Tests - Kotlin (JUnit5 + MockK)

## Fuente de ubicación

Estructura del proyecto: [`.agents/rules/convention-kotlin.md`](../../rules/convention-kotlin.md)  
Convenciones de tests: skill `unit-testing`.

## Estructura

```
src/test/kotlin/com/empresa/proyecto/
├── domain/
│   ├── model/
│   │   └── UsuarioTest.kt
│   └── usecase/
│       └── ObtenerUsuarioUseCaseTest.kt
├── data/
│   └── repository/
│       └── UsuarioRepositoryImplTest.kt
└── presentation/
    └── viewmodel/
        └── UsuariosViewModelTest.kt
```

## Plantilla: Test de Use Case

```kotlin
import io.mockk.*
import io.mockk.impl.annotations.MockK
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import com.google.common.truth.Truth.assertThat

class ObtenerUsuarioUseCaseTest {

    @MockK
    private lateinit var repository: IUsuarioRepository

    private lateinit var sut: ObtenerUsuarioUseCase

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        sut = ObtenerUsuarioUseCase(repository)
    }

    private val tUsuario = Usuario(
        id = "123",
        nombre = "Juan Pérez",
        email = "juan@email.com"
    )

    @Test
    fun `DebeRetornarUsuario CuandoIdExiste`() = runTest {
        // Arrange
        coEvery { repository.obtenerPorId("123") } returns tUsuario

        // Act
        val resultado = sut(ObtenerUsuarioParams(id = "123"))

        // Assert
        assertThat(resultado.isSuccess).isTrue()
        assertThat(resultado.getOrNull()).isEqualTo(tUsuario)
        coVerify(exactly = 1) { repository.obtenerPorId("123") }
    }

    @Test
    fun `DebeRetornarError CuandoIdNoExiste`() = runTest {
        // Arrange
        coEvery { repository.obtenerPorId("999") } returns null

        // Act
        val resultado = sut(ObtenerUsuarioParams(id = "999"))

        // Assert
        assertThat(resultado.isFailure).isTrue()
    }

    @Test
    fun `DebeRetornarError CuandoRepositorioFalla`() = runTest {
        // Arrange
        coEvery { repository.obtenerPorId(any()) } throws RuntimeException("Error de red")

        // Act
        val resultado = sut(ObtenerUsuarioParams(id = "123"))

        // Assert
        assertThat(resultado.isFailure).isTrue()
        assertThat(resultado.exceptionOrNull()?.message).contains("Error de red")
    }
}
```

## Plantilla: Test de Entidad

```kotlin
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import com.google.common.truth.Truth.assertThat

class UsuarioTest {

    @Test
    fun `DebeCrearUsuario CuandoDatosSonValidos`() {
        // Act
        val usuario = Usuario(id = "1", nombre = "Juan", email = "juan@email.com")

        // Assert
        assertThat(usuario.nombre).isEqualTo("Juan")
        assertThat(usuario.estado).isEqualTo(EstadoUsuario.ACTIVO)
    }

    @Test
    fun `DebeLanzarExcepcion CuandoNombreEstaVacio`() {
        // Act & Assert
        assertThrows<IllegalArgumentException> {
            Usuario(id = "1", nombre = "", email = "juan@email.com")
        }
    }

    @Test
    fun `DebeDesactivarUsuario CuandoEstadoEsActivo`() {
        // Arrange
        val usuario = Usuario(id = "1", nombre = "Juan", email = "juan@email.com")

        // Act
        val desactivado = usuario.desactivar()

        // Assert
        assertThat(desactivado.estado).isEqualTo(EstadoUsuario.INACTIVO)
    }

    @Test
    fun `DebeLanzarExcepcion CuandoDesactivaUsuarioInactivo`() {
        // Arrange
        val usuario = Usuario(
            id = "1", nombre = "Juan", email = "j@e.com",
            estado = EstadoUsuario.INACTIVO
        )

        // Act & Assert
        assertThrows<IllegalStateException> { usuario.desactivar() }
    }
}
```

## Plantilla: Test de ViewModel

```kotlin
import app.cash.turbine.test
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import com.google.common.truth.Truth.assertThat

class UsuariosViewModelTest {

    @MockK
    private lateinit var obtenerUsuarioUseCase: ObtenerUsuarioUseCase

    private lateinit var sut: UsuariosViewModel

    private val testDispatcher = StandardTestDispatcher()

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        Dispatchers.setMain(testDispatcher)
        sut = UsuariosViewModel(obtenerUsuarioUseCase)
    }

    @Test
    fun `DebeActualizarUiState CuandoObtieneUsuarioExitosamente`() = runTest {
        // Arrange
        val usuario = Usuario(id = "1", nombre = "Juan", email = "j@e.com")
        coEvery { obtenerUsuarioUseCase(any()) } returns Result.success(usuario)

        // Act
        sut.obtenerUsuario("1")
        advanceUntilIdle()

        // Assert
        sut.uiState.test {
            val state = awaitItem()
            assertThat(state.usuario).isEqualTo(usuario)
            assertThat(state.isLoading).isFalse()
            assertThat(state.error).isNull()
        }
    }

    @Test
    fun `DebeMostrarError CuandoFallaLaCarga`() = runTest {
        // Arrange
        coEvery { obtenerUsuarioUseCase(any()) } returns
            Result.failure(Exception("No encontrado"))

        // Act
        sut.obtenerUsuario("999")
        advanceUntilIdle()

        // Assert
        sut.uiState.test {
            val state = awaitItem()
            assertThat(state.error).contains("No encontrado")
            assertThat(state.isLoading).isFalse()
        }
    }
}
```

## Paquetes de Test

```kotlin
// build.gradle.kts
testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
testImplementation("io.mockk:mockk:1.13.8")
testImplementation("com.google.truth:truth:1.1.5")
testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
testImplementation("app.cash.turbine:turbine:1.0.0") // para Flows
```
