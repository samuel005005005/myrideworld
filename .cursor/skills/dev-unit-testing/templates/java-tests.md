# Template Tests - Java (JUnit 5 + Mockito)

## Fuente de ubicación

Carpetas de test canónicas:

[`.cursor/rules/convention-java.mdc`](../../rules/convention-java.md)

Este archivo solo define **cómo** escribir tests (nombres, AAA, mocks).

## Estructura típica

```
src/test/java/com/empresa/proyecto/
├── domain/model/
├── application/usecase/
└── infrastructure/persistence/
```

## Plantilla: Test de Use Case

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CrearUsuarioUseCaseTest {

    @Mock
    private IUsuarioRepository usuarioRepository;

    @InjectMocks
    private CrearUsuarioUseCase sut;

    @BeforeEach
    void setUp() {
        // Arrange compartido si aplica
    }

    @Test
    void DebeCrearUsuario_CuandoDatosSonValidos() {
        // Arrange
        var request = new CrearUsuarioRequest("Ana", "ana@mail.com");
        when(usuarioRepository.existeEmail("ana@mail.com")).thenReturn(false);
        when(usuarioRepository.guardar(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        var response = sut.ejecutar(request);

        // Assert
        assertNotNull(response);
        verify(usuarioRepository).guardar(any(Usuario.class));
    }

    @Test
    void DebeLanzarExcepcion_CuandoEmailYaExiste() {
        // Arrange
        var request = new CrearUsuarioRequest("Ana", "ana@mail.com");
        when(usuarioRepository.existeEmail("ana@mail.com")).thenReturn(true);

        // Act + Assert
        assertThrows(DomainException.class, () -> sut.ejecutar(request));
        verify(usuarioRepository, never()).guardar(any());
    }
}
```

## Plantilla: Test de Entidad

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UsuarioTest {

    @Test
    void DebeCrearUsuario_CuandoDatosSonValidos() {
        var usuario = Usuario.crear("Ana", "ana@mail.com");

        assertEquals("Ana", usuario.getNombre());
        assertEquals(EstadoUsuario.ACTIVO, usuario.getEstado());
    }

    @Test
    void DebeLanzarExcepcion_CuandoEmailEsInvalido() {
        assertThrows(DomainException.class, () -> Usuario.crear("Ana", "invalido"));
    }
}
```

## Escenarios mínimos

- Caso exitoso
- Validación fallida
- Entidad no encontrada (use case)
- Regla de negocio violada
