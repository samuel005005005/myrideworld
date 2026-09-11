# Template .NET - Clean Architecture + DDD

## Fuente de estructura y convenciones

Árbol de solución, nomenclatura y ejemplos canónicos:

[`.agents/rules/convention-dotnet.md`](../../rules/convention-dotnet.md)

Este archivo solo aporta **plantillas con placeholders** para generar código. Si hay conflicto, gana `estructuras/dotnet.md`.

## Placeholders frecuentes

| Placeholder | Ejemplo |
|-------------|---------|
| `{Entidad}` / `{Feature}` / `{Nombre}` | `Usuario`, `Usuarios`, `CrearUsuario` |

## Plantilla: Entidad

```csharp
public class {Entidad} : BaseEntity, IAggregateRoot
{
    public string {Propiedad} { get; private set; }

    private {Entidad}() { } // EF Core

    public static {Entidad} Crear({params})
    {
        var entidad = new {Entidad} { /* asignaciones */ };
        entidad.AgregarEvento(new {Entidad}CreadoEvent(entidad.Id));
        return entidad;
    }

    public void {Comportamiento}()
    {
        // Validación + lógica + evento
    }
}
```

## Plantilla: Command + Handler

```csharp
public record {Nombre}Command({params}) : IRequest<Result<{Retorno}>>;

public class {Nombre}CommandHandler : IRequestHandler<{Nombre}Command, Result<{Retorno}>>
{
    private readonly I{Entidad}Repository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public {Nombre}CommandHandler(I{Entidad}Repository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<{Retorno}>> Handle({Nombre}Command request, CancellationToken ct)
    {
        // 1. Validar reglas de negocio
        // 2. Crear/modificar entidad
        // 3. Persistir
        // 4. Retornar resultado
    }
}
```

## Plantilla: Validator

```csharp
public class {Nombre}CommandValidator : AbstractValidator<{Nombre}Command>
{
    public {Nombre}CommandValidator()
    {
        RuleFor(x => x.{Campo})
            .NotEmpty().WithMessage("{Campo} es obligatorio.")
            .MaximumLength(100).WithMessage("{Campo} no puede exceder 100 caracteres.");
    }
}
```

## Plantilla: Mappers

Los mappers garantizan la separación entre capas. Nunca exponer una entidad de dominio directamente ni usar un modelo de infraestructura fuera de su capa.

### Flujo de transformación

```
Request DTO → Entidad de Dominio → Modelo de Persistencia (y viceversa)
Entidad de Dominio → Response DTO
```

### Mapper con AutoMapper (Profile)

```csharp
// Application/Common/Mappings/UsuarioMappingProfile.cs

public class UsuarioMappingProfile : Profile
{
    public UsuarioMappingProfile()
    {
        // Entidad → DTO de respuesta
        CreateMap<Usuario, UsuarioDto>()
            .ForMember(dest => dest.NombreCompleto,
                opt => opt.MapFrom(src => $"{src.Nombre} {src.Apellido}"));

        // Command → Entidad (si aplica para creación simple)
        CreateMap<CrearUsuarioCommand, Usuario>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.FechaCreacion, opt => opt.Ignore());
    }
}
```

### Mapper manual (cuando la lógica es compleja o prefieres no usar AutoMapper)

```csharp
// Application/Features/Usuarios/Mappers/UsuarioMapper.cs

public static class UsuarioMapper
{
    public static UsuarioDto ToDto(Usuario entidad)
    {
        return new UsuarioDto(
            Id: entidad.Id,
            Nombre: entidad.Nombre,
            Email: entidad.Email,
            Estado: entidad.Estado.ToString(),
            FechaCreacion: entidad.FechaCreacion
        );
    }

    public static List<UsuarioDto> ToDtoList(IEnumerable<Usuario> entidades)
    {
        return entidades.Select(ToDto).ToList();
    }
}
```

### Mapper de Infraestructura (Modelo ORM ↔ Entidad de Dominio)

```csharp
// Infrastructure/Persistence/Mappers/UsuarioPersistenceMapper.cs

public static class UsuarioPersistenceMapper
{
    public static Usuario ToDomain(UsuarioEntity entity)
    {
        return Usuario.Reconstituir(
            id: entity.Id,
            nombre: entity.Nombre,
            email: entity.Email,
            estado: Enum.Parse<EstadoUsuario>(entity.Estado),
            fechaCreacion: entity.FechaCreacion
        );
    }

    public static UsuarioEntity ToEntity(Usuario dominio)
    {
        return new UsuarioEntity
        {
            Id = dominio.Id,
            Nombre = dominio.Nombre,
            Email = dominio.Email,
            Estado = dominio.Estado.ToString(),
            FechaCreacion = dominio.FechaCreacion
        };
    }
}
```

### Reglas de Mappers

| Dirección | Responsable | Ubicación |
|-----------|-------------|-----------|
| Command/Query → Entidad | Handler o Mapper en Application | `Application/Features/{Feature}/Mappers/` |
| Entidad → DTO respuesta | Mapper en Application | `Application/Common/Mappings/` |
| Entidad ↔ Modelo ORM | Mapper en Infrastructure | `Infrastructure/Persistence/Mappers/` |
| DTO API → Command | Controller (mapping trivial) o Mapper | `API/Mappers/` (solo si es complejo) |

### Qué NO hacer

- No usar AutoMapper para mapeos entre Entidad ↔ Modelo ORM con lógica compleja (preferir manual).
- No exponer entidades de dominio en respuestas HTTP.
- No pasar DTOs de request hasta la capa de dominio.
- No crear un mapper que conozca ambas capas (infra y presentación).

## Paquetes

- MediatR, FluentValidation, AutoMapper/Mapster, EF Core, Serilog, Swashbuckle
