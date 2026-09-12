# Template Java - Clean Architecture + Spring Boot

## Fuente de estructura y convenciones

Árbol de carpetas, nomenclatura y ejemplos canónicos:

[`.cursor/rules/convention-java.mdc`](../../rules/convention-java.md)

Este archivo solo aporta **plantillas con placeholders** (`{Entidad}`, `{Feature}`, etc.) para generar código. Si hay conflicto, gana `estructuras/java.md`.

## Plantilla: Entidad

```java
public class {Entidad} {

    private final String id;
    private String {campo};
    private Estado{Entidad} estado;

    private {Entidad}(String id, String {campo}, Estado{Entidad} estado) {
        this.id = id;
        this.{campo} = {campo};
        this.estado = estado;
        validar();
    }

    public static {Entidad} crear(String {campo}) {
        return new {Entidad}(UUID.randomUUID().toString(), {campo}, Estado{Entidad}.ACTIVO);
    }

    public static {Entidad} reconstituir(String id, String {campo}, Estado{Entidad} estado) {
        return new {Entidad}(id, {campo}, estado);
    }

    public void {comportamiento}() {
        // Validación + lógica de negocio
    }

    private void validar() {
        if ({campo} == null || {campo}.isBlank()) {
            throw new DomainException("{campo} es obligatorio");
        }
    }

    // Getters (sin setters públicos)
}
```

## Plantilla: Use Case

```java
public class {NombreUseCase} {

    private final I{Entidad}Repository repository;

    public {NombreUseCase}(I{Entidad}Repository repository) {
        this.repository = repository;
    }

    public {Retorno}Response ejecutar({Nombre}Request request) {
        // 1. Validar reglas de negocio
        // 2. Crear/modificar entidad
        // 3. Persistir
        // 4. Mapear y retornar
        return {Entidad}ApplicationMapper.toResponse(guardado);
    }
}
```

## Plantilla: DTO (Record)

```java
public record {Nombre}Request(
    @NotBlank(message = "{campo} es obligatorio")
    @Size(max = 100)
    String {campo}
) {}

public record {Nombre}Response(
    String id,
    String {campo},
    String estado
) {}
```

## Plantilla: Mapper Aplicación

```java
public final class {Entidad}ApplicationMapper {

    private {Entidad}ApplicationMapper() {}

    public static {Entidad}Response toResponse({Entidad} entidad) {
        return new {Entidad}Response(
            entidad.getId(),
            entidad.get{Campo}(),
            entidad.getEstado().name()
        );
    }

    public static List<{Entidad}Response> toResponseList(List<{Entidad}> entidades) {
        return entidades.stream().map({Entidad}ApplicationMapper::toResponse).toList();
    }
}
```

## Plantilla: Mapper Persistencia

```java
public final class {Entidad}PersistenceMapper {

    private {Entidad}PersistenceMapper() {}

    public static {Entidad} toDomain({Entidad}JpaEntity jpa) {
        return {Entidad}.reconstituir(
            jpa.getId(),
            jpa.get{Campo}(),
            Estado{Entidad}.valueOf(jpa.getEstado())
        );
    }

    public static {Entidad}JpaEntity toJpa({Entidad} dominio) {
        return new {Entidad}JpaEntity(
            dominio.getId(),
            dominio.get{Campo}(),
            dominio.getEstado().name()
        );
    }

    public static List<{Entidad}> toDomainList(List<{Entidad}JpaEntity> entities) {
        return entities.stream().map({Entidad}PersistenceMapper::toDomain).toList();
    }
}
```

## Plantilla: Controller

```java
@RestController
@RequestMapping("/api/{feature}")
public class {Feature}Controller {

    private final {NombreUseCase} useCase;

    public {Feature}Controller({NombreUseCase} useCase) {
        this.useCase = useCase;
    }

    @PostMapping
    public ResponseEntity<{Entidad}Response> crear(@Valid @RequestBody {Nombre}Request request) {
        {Entidad}Response response = useCase.ejecutar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

## Plantilla: Bean Config

```java
@Configuration
public class BeanConfig {

    @Bean
    public {NombreUseCase} {nombreUseCase}(I{Entidad}Repository repository) {
        return new {NombreUseCase}(repository);
    }
}
```

## Paquetes

- Spring Boot 3.x, Spring Data JPA, Jakarta Validation, JUnit 5, Mockito, AssertJ, Testcontainers, Flyway/Liquibase, MapStruct (opcional)
