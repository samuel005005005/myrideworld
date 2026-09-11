---
description: Convenciones Java Clean Architecture + Spring Boot
globs: **/*.java
alwaysApply: false
---
# Estructura Java - Clean Architecture + Spring Boot

## Estructura de Proyecto

```
📁 src/main/java/com/empresa/proyecto/
├── 📁 domain/                             # Capa de Dominio
│   ├── 📁 model/
│   │   ├── Producto.java
│   │   └── Usuario.java
│   ├── 📁 valueobject/
│   │   └── Email.java
│   ├── 📁 repository/                     # Interfaces de repositorios
│   │   └── IUsuarioRepository.java
│   ├── 📁 service/                        # Servicios de dominio
│   │   └── PrecioService.java
│   ├── 📁 exception/
│   │   ├── DomainException.java
│   │   └── UsuarioNoEncontradoException.java
│   └── 📁 event/
│       └── UsuarioCreadoEvent.java
│
├── 📁 application/                        # Capa de Aplicación
│   ├── 📁 usecase/
│   │   ├── CrearUsuarioUseCase.java
│   │   ├── ObtenerUsuarioUseCase.java
│   │   └── ListarUsuariosUseCase.java
│   ├── 📁 dto/
│   │   ├── CrearUsuarioRequest.java
│   │   └── UsuarioResponse.java
│   ├── 📁 mapper/
│   │   └── UsuarioApplicationMapper.java  # Entidad → Response DTO
│   └── 📁 validator/
│       └── CrearUsuarioValidator.java
│
├── 📁 infrastructure/                     # Capa de Infraestructura
│   ├── 📁 persistence/
│   │   ├── 📁 entity/
│   │   │   └── UsuarioJpaEntity.java      # Entidad JPA
│   │   ├── 📁 repository/
│   │   │   ├── UsuarioJpaRepository.java  # Interface Spring Data
│   │   │   └── UsuarioRepositoryImpl.java # Implementación del dominio
│   │   └── 📁 mapper/
│   │       └── UsuarioPersistenceMapper.java  # JPA Entity ↔ Entidad Domain
│   ├── 📁 config/
│   │   ├── BeanConfig.java
│   │   └── SecurityConfig.java
│   └── 📁 client/
│       └── NotificacionClient.java        # Clientes HTTP externos
│
├── 📁 presentation/                       # Capa de Presentación (API)
│   ├── 📁 controller/
│   │   └── UsuarioController.java
│   ├── 📁 handler/
│   │   └── GlobalExceptionHandler.java
│   └── 📁 dto/                            # DTOs específicos de API (si difieren)
│
└── Application.java                       # Entry point Spring Boot

📁 src/test/java/com/empresa/proyecto/
├── 📁 domain/
│   └── 📁 model/
│       └── UsuarioTest.java
├── 📁 application/
│   └── 📁 usecase/
│       └── CrearUsuarioUseCaseTest.java
└── 📁 infrastructure/
    └── 📁 persistence/
        └── UsuarioRepositoryImplTest.java
```

---

## Patrones por Capa

### Dominio - Entidad

```java
package com.empresa.proyecto.domain.model;

import com.empresa.proyecto.domain.exception.DomainException;
import com.empresa.proyecto.domain.valueobject.Email;

import java.util.UUID;

/**
 * Entidad raíz del agregado Usuario.
 * Encapsula lógica de negocio y validaciones.
 */
public class Usuario {

    private final String id;
    private String nombre;
    private Email email;
    private EstadoUsuario estado;

    private Usuario(String id, String nombre, Email email, EstadoUsuario estado) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.estado = estado;
        validar();
    }

    public static Usuario crear(String nombre, String email) {
        return new Usuario(
            UUID.randomUUID().toString(),
            nombre,
            Email.of(email),
            EstadoUsuario.ACTIVO
        );
    }

    public static Usuario reconstituir(String id, String nombre, String email, EstadoUsuario estado) {
        return new Usuario(id, nombre, Email.of(email), estado);
    }

    public void desactivar() {
        if (this.estado == EstadoUsuario.INACTIVO) {
            throw new DomainException("El usuario ya está inactivo");
        }
        this.estado = EstadoUsuario.INACTIVO;
    }

    public void cambiarEmail(String nuevoEmail) {
        Email nuevo = Email.of(nuevoEmail);
        if (this.email.equals(nuevo)) {
            throw new DomainException("El nuevo email es igual al actual");
        }
        this.email = nuevo;
    }

    private void validar() {
        if (nombre == null || nombre.isBlank()) {
            throw new DomainException("El nombre no puede estar vacío");
        }
    }

    // Getters (sin setters públicos)
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public Email getEmail() { return email; }
    public EstadoUsuario getEstado() { return estado; }
}
```

### Dominio - Value Object

```java
package com.empresa.proyecto.domain.valueobject;

import com.empresa.proyecto.domain.exception.DomainException;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value Object inmutable para email validado.
 */
public final class Email {

    private static final Pattern PATTERN = Pattern.compile(
        "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private final String valor;

    private Email(String valor) {
        this.valor = valor;
    }

    public static Email of(String valor) {
        if (valor == null || !PATTERN.matcher(valor).matches()) {
            throw new DomainException("Email inválido: " + valor);
        }
        return new Email(valor);
    }

    public String getValor() { return valor; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email other)) return false;
        return Objects.equals(valor, other.valor);
    }

    @Override
    public int hashCode() { return Objects.hash(valor); }

    @Override
    public String toString() { return valor; }
}
```

### Dominio - Interfaz de Repositorio

```java
package com.empresa.proyecto.domain.repository;

import com.empresa.proyecto.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para persistencia de usuarios.
 */
public interface IUsuarioRepository {
    Optional<Usuario> obtenerPorId(String id);
    Optional<Usuario> obtenerPorEmail(String email);
    List<Usuario> listarTodos();
    Usuario guardar(Usuario usuario);
    void eliminar(String id);
    boolean existeEmail(String email);
}
```

### Dominio - Excepción

```java
package com.empresa.proyecto.domain.exception;

/**
 * Excepción base para errores de reglas de negocio.
 */
public class DomainException extends RuntimeException {
    public DomainException(String mensaje) {
        super(mensaje);
    }
}
```

### Aplicación - Caso de Uso

```java
package com.empresa.proyecto.application.usecase;

import com.empresa.proyecto.application.dto.CrearUsuarioRequest;
import com.empresa.proyecto.application.dto.UsuarioResponse;
import com.empresa.proyecto.application.mapper.UsuarioApplicationMapper;
import com.empresa.proyecto.domain.exception.DomainException;
import com.empresa.proyecto.domain.model.Usuario;
import com.empresa.proyecto.domain.repository.IUsuarioRepository;

/**
 * Caso de uso: Crear un nuevo usuario.
 */
public class CrearUsuarioUseCase {

    private final IUsuarioRepository usuarioRepository;

    public CrearUsuarioUseCase(IUsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponse ejecutar(CrearUsuarioRequest request) {
        if (usuarioRepository.existeEmail(request.email())) {
            throw new DomainException("El email ya está registrado");
        }

        Usuario usuario = Usuario.crear(request.nombre(), request.email());
        Usuario guardado = usuarioRepository.guardar(usuario);

        return UsuarioApplicationMapper.toResponse(guardado);
    }
}
```

### Aplicación - DTOs (Records)

```java
package com.empresa.proyecto.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearUsuarioRequest(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    String nombre,

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    String email
) {}
```

```java
package com.empresa.proyecto.application.dto;

public record UsuarioResponse(
    String id,
    String nombre,
    String email,
    String estado
) {}
```

### Aplicación - Mapper

```java
package com.empresa.proyecto.application.mapper;

import com.empresa.proyecto.application.dto.UsuarioResponse;
import com.empresa.proyecto.domain.model.Usuario;

import java.util.List;

/**
 * Mapper entre entidades de dominio y DTOs de respuesta.
 */
public final class UsuarioApplicationMapper {

    private UsuarioApplicationMapper() {}

    public static UsuarioResponse toResponse(Usuario entidad) {
        return new UsuarioResponse(
            entidad.getId(),
            entidad.getNombre(),
            entidad.getEmail().getValor(),
            entidad.getEstado().name()
        );
    }

    public static List<UsuarioResponse> toResponseList(List<Usuario> entidades) {
        return entidades.stream().map(UsuarioApplicationMapper::toResponse).toList();
    }
}
```

### Infraestructura - Entidad JPA

```java
package com.empresa.proyecto.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class UsuarioJpaEntity {

    @Id
    private String id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private String estado;

    // Constructor vacío para JPA
    protected UsuarioJpaEntity() {}

    public UsuarioJpaEntity(String id, String nombre, String email, String estado) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.estado = estado;
    }

    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getEstado() { return estado; }
}
```

### Infraestructura - Mapper de Persistencia

```java
package com.empresa.proyecto.infrastructure.persistence.mapper;

import com.empresa.proyecto.domain.model.EstadoUsuario;
import com.empresa.proyecto.domain.model.Usuario;
import com.empresa.proyecto.infrastructure.persistence.entity.UsuarioJpaEntity;

import java.util.List;

/**
 * Mapper entre entidades JPA y entidades de dominio.
 * Solo vive en la capa de infraestructura.
 */
public final class UsuarioPersistenceMapper {

    private UsuarioPersistenceMapper() {}

    public static Usuario toDomain(UsuarioJpaEntity jpa) {
        return Usuario.reconstituir(
            jpa.getId(),
            jpa.getNombre(),
            jpa.getEmail(),
            EstadoUsuario.valueOf(jpa.getEstado())
        );
    }

    public static UsuarioJpaEntity toJpa(Usuario dominio) {
        return new UsuarioJpaEntity(
            dominio.getId(),
            dominio.getNombre(),
            dominio.getEmail().getValor(),
            dominio.getEstado().name()
        );
    }

    public static List<Usuario> toDomainList(List<UsuarioJpaEntity> entities) {
        return entities.stream().map(UsuarioPersistenceMapper::toDomain).toList();
    }
}
```

### Infraestructura - Repositorio

```java
package com.empresa.proyecto.infrastructure.persistence.repository;

import com.empresa.proyecto.domain.model.Usuario;
import com.empresa.proyecto.domain.repository.IUsuarioRepository;
import com.empresa.proyecto.infrastructure.persistence.entity.UsuarioJpaEntity;
import com.empresa.proyecto.infrastructure.persistence.mapper.UsuarioPersistenceMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepositoryImpl implements IUsuarioRepository {

    private final UsuarioJpaRepository jpaRepository;

    public UsuarioRepositoryImpl(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Usuario> obtenerPorId(String id) {
        return jpaRepository.findById(id)
            .map(UsuarioPersistenceMapper::toDomain);
    }

    @Override
    public Optional<Usuario> obtenerPorEmail(String email) {
        return jpaRepository.findByEmail(email)
            .map(UsuarioPersistenceMapper::toDomain);
    }

    @Override
    public List<Usuario> listarTodos() {
        return UsuarioPersistenceMapper.toDomainList(jpaRepository.findAll());
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        UsuarioJpaEntity entity = UsuarioPersistenceMapper.toJpa(usuario);
        UsuarioJpaEntity saved = jpaRepository.save(entity);
        return UsuarioPersistenceMapper.toDomain(saved);
    }

    @Override
    public void eliminar(String id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existeEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
}
```

### Infraestructura - JPA Repository (Spring Data)

```java
package com.empresa.proyecto.infrastructure.persistence.repository;

import com.empresa.proyecto.infrastructure.persistence.entity.UsuarioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioJpaEntity, String> {
    Optional<UsuarioJpaEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### Infraestructura - Configuración de Beans

```java
package com.empresa.proyecto.infrastructure.config;

import com.empresa.proyecto.application.usecase.CrearUsuarioUseCase;
import com.empresa.proyecto.application.usecase.ObtenerUsuarioUseCase;
import com.empresa.proyecto.domain.repository.IUsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public CrearUsuarioUseCase crearUsuarioUseCase(IUsuarioRepository repository) {
        return new CrearUsuarioUseCase(repository);
    }

    @Bean
    public ObtenerUsuarioUseCase obtenerUsuarioUseCase(IUsuarioRepository repository) {
        return new ObtenerUsuarioUseCase(repository);
    }
}
```

### Presentación - Controller

```java
package com.empresa.proyecto.presentation.controller;

import com.empresa.proyecto.application.dto.CrearUsuarioRequest;
import com.empresa.proyecto.application.dto.UsuarioResponse;
import com.empresa.proyecto.application.usecase.CrearUsuarioUseCase;
import com.empresa.proyecto.application.usecase.ObtenerUsuarioUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final CrearUsuarioUseCase crearUsuarioUseCase;
    private final ObtenerUsuarioUseCase obtenerUsuarioUseCase;

    public UsuarioController(
        CrearUsuarioUseCase crearUsuarioUseCase,
        ObtenerUsuarioUseCase obtenerUsuarioUseCase
    ) {
        this.crearUsuarioUseCase = crearUsuarioUseCase;
        this.obtenerUsuarioUseCase = obtenerUsuarioUseCase;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody CrearUsuarioRequest request) {
        UsuarioResponse response = crearUsuarioUseCase.ejecutar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable String id) {
        UsuarioResponse response = obtenerUsuarioUseCase.ejecutar(id);
        return ResponseEntity.ok(response);
    }
}
```

### Presentación - Exception Handler

```java
package com.empresa.proyecto.presentation.handler;

import com.empresa.proyecto.domain.exception.DomainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<Map<String, String>> handleDomain(DomainException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String mensaje = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .reduce((a, b) -> a + "; " + b)
            .orElse("Error de validación");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", mensaje));
    }
}
```

---

## Mappers - Resumen

### Flujo de transformación

```
JPA Entity (infra) → Entidad Domain → Response DTO (application)
Request DTO (presentation) → Entidad Domain → JPA Entity (infra)
```

### Reglas de Mappers

| Dirección | Ubicación | Responsable |
|-----------|-----------|-------------|
| JPA Entity → Entidad Domain | `infrastructure/persistence/mapper/` | Repositorio |
| Entidad Domain → JPA Entity | `infrastructure/persistence/mapper/` | Repositorio |
| Entidad Domain → Response DTO | `application/mapper/` | Use Case |
| Request DTO → Entidad Domain | Use Case directamente (vía factory method) | Use Case |

### Qué NO hacer

- No usar anotaciones JPA (`@Entity`, `@Column`) en entidades de dominio.
- No retornar entidades de dominio desde controllers.
- No inyectar repositorios JPA (Spring Data) directamente en los use cases.
- No mezclar DTOs de request con DTOs de response en la misma clase.

---

## Librerías Recomendadas

| Librería | Propósito |
|----------|-----------|
| Spring Boot 3.x | Framework web |
| Spring Data JPA | Persistencia |
| Jakarta Validation | Validación de DTOs |
| Lombok (opcional) | Reducir boilerplate |
| MapStruct (opcional) | Generación de mappers |
| JUnit 5 + Mockito | Testing |
| AssertJ | Assertions fluidas |
| Testcontainers | Tests de integración |
| Flyway / Liquibase | Migraciones |

---

## Convenciones de Nomenclatura Java

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Paquetes | lowercase | `com.empresa.proyecto.domain.model` |
| Clases | PascalCase | `UsuarioRepository` |
| Interfaces | PascalCase con prefijo I (dominio) | `IUsuarioRepository` |
| Interfaces Spring Data | PascalCase + JpaRepository | `UsuarioJpaRepository` |
| Métodos | camelCase | `obtenerPorId()` |
| Variables | camelCase | `nombreCompleto` |
| Constantes | UPPER_SNAKE_CASE | `MAX_REINTENTOS` |
| Records (DTOs) | PascalCase + sufijo | `CrearUsuarioRequest`, `UsuarioResponse` |
| Use Cases | Verbo + Sustantivo + UseCase | `CrearUsuarioUseCase` |
| Entidades JPA | PascalCase + JpaEntity | `UsuarioJpaEntity` |
| Mappers | PascalCase + Mapper | `UsuarioPersistenceMapper` |
| Excepciones | Descriptiva + Exception | `UsuarioNoEncontradoException` |

---

## Reglas para el Agente

1. **Entidades de dominio sin anotaciones de framework**. No usar `@Entity`, `@Data`, `@Autowired` en el dominio.
2. **Records para DTOs**. Inmutables por defecto, con validación via Jakarta Validation.
3. **Inyección por constructor** siempre. No usar `@Autowired` en campos.
4. **Use cases como clases simples** (no `@Service`). Se registran como Beans en una clase `@Configuration`.
5. **Mappers como clases utilitarias** con métodos estáticos y constructor privado. O usar MapStruct si el equipo lo prefiere.
6. **Un use case por operación**. Método principal: `ejecutar()`.
7. **Controllers solo despachan** a use cases. Cero lógica de negocio.
8. **Optional** para retornos que pueden ser null. No usar null directamente.
9. **Factory methods** en entidades (`crear()`, `reconstituir()`) en vez de constructores públicos.
10. **No usar Lombok en dominio**. En infraestructura y DTOs es aceptable si el equipo lo prefiere, pero Records son preferidos para DTOs.
