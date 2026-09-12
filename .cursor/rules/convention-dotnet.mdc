---
description: Convenciones .NET Clean Architecture + DDD
globs: **/*.cs
alwaysApply: false
---
# Estructura Base - .NET con Clean Architecture + DDD

## Propósito

Este documento define la estructura obligatoria para proyectos .NET que siguen Clean Architecture con Domain-Driven Design. Se activa automáticamente cuando se trabaja con archivos `.cs`.

---

## Estructura de Solución

```
📁 src/
├── 📁 NombreProyecto.Domain/              # Capa de Dominio (núcleo)
│   ├── 📁 Entities/                       # Entidades de dominio
│   ├── 📁 ValueObjects/                   # Value Objects
│   ├── 📁 Enums/                          # Enumeraciones de dominio
│   ├── 📁 Events/                         # Eventos de dominio
│   ├── 📁 Exceptions/                     # Excepciones de dominio
│   ├── 📁 Interfaces/                     # Interfaces de repositorios y servicios de dominio
│   │   ├── IRepository.cs                 # Interfaz genérica base
│   │   ├── IUnitOfWork.cs
│   │   └── IUsuarioRepository.cs          # Interfaces específicas por agregado
│   ├── 📁 Services/                       # Servicios de dominio (lógica entre agregados)
│   └── 📁 Specifications/                 # Patrón Specification (opcional)
│
├── 📁 NombreProyecto.Application/         # Capa de Aplicación
│   ├── 📁 Common/
│   │   ├── 📁 Behaviours/                 # Pipeline behaviors (validación, logging)
│   │   ├── 📁 Interfaces/                 # Interfaces de servicios de aplicación
│   │   ├── 📁 Mappings/                   # Perfiles de AutoMapper/Mapster
│   │   └── 📁 Models/                     # Modelos compartidos (paginación, resultado)
│   ├── 📁 Features/                       # Agrupado por feature/caso de uso
│   │   └── 📁 Usuarios/
│   │       ├── 📁 Commands/
│   │       │   ├── 📁 CrearUsuario/
│   │       │   │   ├── CrearUsuarioCommand.cs
│   │       │   │   ├── CrearUsuarioCommandHandler.cs
│   │       │   │   └── CrearUsuarioCommandValidator.cs
│   │       │   └── 📁 ActualizarUsuario/
│   │       └── 📁 Queries/
│   │           ├── 📁 ObtenerUsuarioPorId/
│   │           │   ├── ObtenerUsuarioPorIdQuery.cs
│   │           │   ├── ObtenerUsuarioPorIdQueryHandler.cs
│   │           │   └── UsuarioDto.cs
│   │           └── 📁 ListarUsuarios/
│   └── 📁 DependencyInjection.cs          # Registro de servicios de aplicación
│
├── 📁 NombreProyecto.Infrastructure/      # Capa de Infraestructura
│   ├── 📁 Persistence/
│   │   ├── 📁 Configurations/            # Configuraciones de EF Core (IEntityTypeConfiguration)
│   │   ├── 📁 Migrations/                # Migraciones de EF Core
│   │   ├── 📁 Repositories/              # Implementaciones de repositorios
│   │   ├── ApplicationDbContext.cs
│   │   └── UnitOfWork.cs
│   ├── 📁 Services/                       # Implementaciones de servicios externos
│   │   ├── EmailService.cs
│   │   ├── FileStorageService.cs
│   │   └── DateTimeService.cs
│   ├── 📁 Identity/                       # Autenticación y autorización
│   └── 📁 DependencyInjection.cs          # Registro de servicios de infraestructura
│
├── 📁 NombreProyecto.API/                 # Capa de Presentación (Web API)
│   ├── 📁 Controllers/
│   │   └── UsuariosController.cs
│   ├── 📁 Filters/                        # Filtros de acción (excepciones, validación)
│   ├── 📁 Middlewares/                    # Middlewares personalizados
│   ├── 📁 Extensions/                     # Métodos de extensión para Program.cs
│   ├── Program.cs
│   └── appsettings.json
│
📁 tests/
├── 📁 NombreProyecto.Domain.Tests/        # Tests unitarios de dominio
├── 📁 NombreProyecto.Application.Tests/   # Tests unitarios de aplicación
├── 📁 NombreProyecto.Infrastructure.Tests/ # Tests de integración
└── 📁 NombreProyecto.API.Tests/           # Tests de API (integration tests)
```

---

## Patrones y Convenciones por Capa

### Dominio - Entidades

```csharp
namespace NombreProyecto.Domain.Entities;

/// <summary>
/// Entidad raíz del agregado Usuario.
/// </summary>
public class Usuario : BaseEntity, IAggregateRoot
{
    // Propiedades con setter privado (encapsulación)
    public string Nombre { get; private set; }
    public string Email { get; private set; }
    public EstadoUsuario Estado { get; private set; }

    // Colecciones como IReadOnlyCollection
    private readonly List<Rol> _roles = new();
    public IReadOnlyCollection<Rol> Roles => _roles.AsReadOnly();

    // Constructor privado para EF Core
    private Usuario() { }

    // Factory method para creación controlada
    public static Usuario Crear(string nombre, string email)
    {
        var usuario = new Usuario
        {
            Nombre = nombre ?? throw new ArgumentNullException(nameof(nombre)),
            Email = email ?? throw new ArgumentNullException(nameof(email)),
            Estado = EstadoUsuario.Activo
        };

        usuario.AgregarEvento(new UsuarioCreadoEvent(usuario.Id));
        return usuario;
    }

    // Métodos de comportamiento (no anémico)
    public void Desactivar()
    {
        if (Estado == EstadoUsuario.Inactivo)
            throw new DomainException("El usuario ya está inactivo.");

        Estado = EstadoUsuario.Inactivo;
        AgregarEvento(new UsuarioDesactivadoEvent(Id));
    }

    public void AsignarRol(Rol rol)
    {
        if (_roles.Contains(rol))
            throw new DomainException($"El usuario ya tiene el rol {rol.Nombre}.");

        _roles.Add(rol);
    }
}
```

### Dominio - Value Objects

```csharp
namespace NombreProyecto.Domain.ValueObjects;

public class Direccion : ValueObject
{
    public string Calle { get; }
    public string Ciudad { get; }
    public string CodigoPostal { get; }

    public Direccion(string calle, string ciudad, string codigoPostal)
    {
        if (string.IsNullOrWhiteSpace(calle))
            throw new DomainException("La calle es obligatoria.");

        Calle = calle;
        Ciudad = ciudad;
        CodigoPostal = codigoPostal;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Calle;
        yield return Ciudad;
        yield return CodigoPostal;
    }
}
```

### Dominio - Interfaces de Repositorio

```csharp
namespace NombreProyecto.Domain.Interfaces;

public interface IUsuarioRepository : IRepository<Usuario>
{
    Task<Usuario?> ObtenerPorEmailAsync(string email, CancellationToken ct = default);
    Task<bool> ExisteEmailAsync(string email, CancellationToken ct = default);
}

// Interfaz genérica base
public interface IRepository<T> where T : BaseEntity, IAggregateRoot
{
    Task<T?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListarTodosAsync(CancellationToken ct = default);
    Task AgregarAsync(T entity, CancellationToken ct = default);
    void Actualizar(T entity);
    void Eliminar(T entity);
}
```

### Aplicación - Commands (CQRS con MediatR)

```csharp
namespace NombreProyecto.Application.Features.Usuarios.Commands.CrearUsuario;

// Command
public record CrearUsuarioCommand(
    string Nombre,
    string Email,
    string Password
) : IRequest<Result<Guid>>;

// Handler
public class CrearUsuarioCommandHandler : IRequestHandler<CrearUsuarioCommand, Result<Guid>>
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CrearUsuarioCommandHandler(
        IUsuarioRepository usuarioRepository,
        IUnitOfWork unitOfWork)
    {
        _usuarioRepository = usuarioRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(
        CrearUsuarioCommand request,
        CancellationToken cancellationToken)
    {
        if (await _usuarioRepository.ExisteEmailAsync(request.Email, cancellationToken))
            return Result<Guid>.Failure("El email ya está registrado.");

        var usuario = Usuario.Crear(request.Nombre, request.Email);

        await _usuarioRepository.AgregarAsync(usuario, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(usuario.Id);
    }
}

// Validator (FluentValidation)
public class CrearUsuarioCommandValidator : AbstractValidator<CrearUsuarioCommand>
{
    public CrearUsuarioCommandValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(100).WithMessage("El nombre no puede exceder 100 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es obligatorio.")
            .EmailAddress().WithMessage("El formato del email no es válido.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria.")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres.");
    }
}
```

### Aplicación - Queries

```csharp
namespace NombreProyecto.Application.Features.Usuarios.Queries.ObtenerUsuarioPorId;

public record ObtenerUsuarioPorIdQuery(Guid Id) : IRequest<Result<UsuarioDto>>;

public class ObtenerUsuarioPorIdQueryHandler
    : IRequestHandler<ObtenerUsuarioPorIdQuery, Result<UsuarioDto>>
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IMapper _mapper;

    public ObtenerUsuarioPorIdQueryHandler(
        IUsuarioRepository usuarioRepository,
        IMapper mapper)
    {
        _usuarioRepository = usuarioRepository;
        _mapper = mapper;
    }

    public async Task<Result<UsuarioDto>> Handle(
        ObtenerUsuarioPorIdQuery request,
        CancellationToken cancellationToken)
    {
        var usuario = await _usuarioRepository.ObtenerPorIdAsync(request.Id, cancellationToken);

        if (usuario is null)
            return Result<UsuarioDto>.Failure("Usuario no encontrado.");

        return Result<UsuarioDto>.Success(_mapper.Map<UsuarioDto>(usuario));
    }
}
```

### Infraestructura - Repositorio

```csharp
namespace NombreProyecto.Infrastructure.Persistence.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly ApplicationDbContext _context;

    public UsuarioRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Usuarios
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == id, ct);
    }

    public async Task<Usuario?> ObtenerPorEmailAsync(string email, CancellationToken ct = default)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public async Task<bool> ExisteEmailAsync(string email, CancellationToken ct = default)
    {
        return await _context.Usuarios.AnyAsync(u => u.Email == email, ct);
    }

    public async Task<IReadOnlyList<Usuario>> ListarTodosAsync(CancellationToken ct = default)
    {
        return await _context.Usuarios.ToListAsync(ct);
    }

    public async Task AgregarAsync(Usuario entity, CancellationToken ct = default)
    {
        await _context.Usuarios.AddAsync(entity, ct);
    }

    public void Actualizar(Usuario entity)
    {
        _context.Usuarios.Update(entity);
    }

    public void Eliminar(Usuario entity)
    {
        _context.Usuarios.Remove(entity);
    }
}
```

### Presentación - Controller

```csharp
namespace NombreProyecto.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsuariosController : ControllerBase
{
    private readonly ISender _mediator;

    public UsuariosController(ISender mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Obtiene un usuario por su ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UsuarioDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(Guid id, CancellationToken ct)
    {
        var resultado = await _mediator.Send(new ObtenerUsuarioPorIdQuery(id), ct);

        return resultado.IsSuccess
            ? Ok(resultado.Value)
            : NotFound(resultado.Error);
    }

    /// <summary>
    /// Crea un nuevo usuario.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Crear(
        [FromBody] CrearUsuarioCommand command,
        CancellationToken ct)
    {
        var resultado = await _mediator.Send(command, ct);

        return resultado.IsSuccess
            ? CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Value }, resultado.Value)
            : BadRequest(resultado.Error);
    }
}
```

---

## Paquetes NuGet Recomendados

| Paquete | Capa | Propósito |
|---------|------|-----------|
| `MediatR` | Application | CQRS, mediator pattern |
| `FluentValidation` | Application | Validación de commands/queries |
| `AutoMapper` o `Mapster` | Application | Mapeo entidad ↔ DTO |
| `Microsoft.EntityFrameworkCore` | Infrastructure | ORM |
| `Serilog` | Transversal | Logging estructurado |
| `Swashbuckle.AspNetCore` | API | Documentación Swagger |

---

## Registro de Dependencias (DI)

```csharp
// Application/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }
}

// Infrastructure/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();

        return services;
    }
}
```

---

## Convenciones de Nomenclatura .NET

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Namespace | `Proyecto.Capa.Feature` | `MiApp.Application.Features.Usuarios` |
| Interfaz | `I` + PascalCase | `IUsuarioRepository` |
| Clase abstracta | PascalCase (sin prefijo) | `BaseEntity` |
| Command | Verbo + Sustantivo + `Command` | `CrearUsuarioCommand` |
| Query | Verbo + Sustantivo + `Query` | `ObtenerUsuarioPorIdQuery` |
| Handler | Mismo nombre + `Handler` | `CrearUsuarioCommandHandler` |
| Validator | Mismo nombre + `Validator` | `CrearUsuarioCommandValidator` |
| DTO | Sustantivo + `Dto` | `UsuarioDto` |
| Excepción de dominio | Descriptiva + `Exception` | `UsuarioNoEncontradoException` |
| Evento de dominio | Sustantivo + Participio + `Event` | `UsuarioCreadoEvent` |
| Métodos async | Sufijo `Async` | `ObtenerPorIdAsync` |

---

## Reglas para el Agente

1. **Respeta la estructura de carpetas** definida. No crees archivos fuera de su capa correspondiente.
2. **Un archivo por clase**. No agrupes múltiples clases en un solo archivo.
3. **Usa records para Commands/Queries/DTOs** (inmutabilidad por defecto).
4. **Toda entidad debe tener comportamiento** (no modelos anémicos). La lógica de negocio va en la entidad.
5. **Los Controllers solo despachan** a MediatR. Cero lógica de negocio en controllers.
6. **Usa CancellationToken** en todos los métodos async.
7. **Valida con FluentValidation** en la capa de aplicación, no en controllers.
8. **Nombra en español** las clases de dominio y DTOs si el equipo lo prefiere, pero mantén consistencia.
9. **Crea el Validator** junto con cada Command nuevo.
10. **Inyecta por interfaz**, nunca por clase concreta.
