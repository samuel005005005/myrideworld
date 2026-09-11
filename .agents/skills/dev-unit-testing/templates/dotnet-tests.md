# Template Tests - .NET (xUnit + Moq + FluentAssertions)

## Fuente de ubicación

Estructura de solución: [`.agents/rules/convention-dotnet.md`](../../rules/convention-dotnet.md)  
Convenciones de tests: skill `unit-testing`.

## Estructura

```
tests/
└── NombreProyecto.Application.Tests/
    └── Features/
        └── Usuarios/
            └── Commands/
                └── CrearUsuario/
                    └── CrearUsuarioCommandHandlerTests.cs
```

## Plantilla: Test de Use Case (Command Handler)

```csharp
using FluentAssertions;
using Moq;
using Xunit;

namespace NombreProyecto.Application.Tests.Features.Usuarios.Commands.CrearUsuario;

public class CrearUsuarioCommandHandlerTests
{
    private readonly Mock<IUsuarioRepository> _usuarioRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly CrearUsuarioCommandHandler _sut;

    public CrearUsuarioCommandHandlerTests()
    {
        _usuarioRepositoryMock = new Mock<IUsuarioRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _sut = new CrearUsuarioCommandHandler(
            _usuarioRepositoryMock.Object,
            _unitOfWorkMock.Object);
    }

    [Fact]
    public async Task DebeCrearUsuario_CuandoDatosSonValidos()
    {
        // Arrange
        var command = new CrearUsuarioCommand("Juan Pérez", "juan@email.com", "Pass1234");
        _usuarioRepositoryMock
            .Setup(x => x.ExisteEmailAsync(command.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var resultado = await _sut.Handle(command, CancellationToken.None);

        // Assert
        resultado.IsSuccess.Should().BeTrue();
        resultado.Value.Should().NotBeEmpty();
        _usuarioRepositoryMock.Verify(
            x => x.AgregarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Once);
        _unitOfWorkMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task DebeRetornarError_CuandoEmailYaRegistrado()
    {
        // Arrange
        var command = new CrearUsuarioCommand("Juan Pérez", "existente@email.com", "Pass1234");
        _usuarioRepositoryMock
            .Setup(x => x.ExisteEmailAsync(command.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var resultado = await _sut.Handle(command, CancellationToken.None);

        // Assert
        resultado.IsSuccess.Should().BeFalse();
        resultado.Error.Should().Contain("email");
        _usuarioRepositoryMock.Verify(
            x => x.AgregarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }
}
```

## Plantilla: Test de Entidad

```csharp
public class UsuarioTests
{
    [Fact]
    public void DebeCrearUsuario_CuandoDatosSonValidos()
    {
        // Act
        var usuario = Usuario.Crear("Juan Pérez", "juan@email.com");

        // Assert
        usuario.Nombre.Should().Be("Juan Pérez");
        usuario.Email.Should().Be("juan@email.com");
        usuario.Estado.Should().Be(EstadoUsuario.Activo);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void DebeLanzarExcepcion_CuandoNombreEsInvalido(string nombre)
    {
        // Act
        var accion = () => Usuario.Crear(nombre, "juan@email.com");

        // Assert
        accion.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void DebeDesactivarUsuario_CuandoEstadoEsActivo()
    {
        // Arrange
        var usuario = Usuario.Crear("Juan Pérez", "juan@email.com");

        // Act
        usuario.Desactivar();

        // Assert
        usuario.Estado.Should().Be(EstadoUsuario.Inactivo);
    }

    [Fact]
    public void DebeLanzarExcepcion_CuandoDesactivaUsuarioYaInactivo()
    {
        // Arrange
        var usuario = Usuario.Crear("Juan Pérez", "juan@email.com");
        usuario.Desactivar();

        // Act
        var accion = () => usuario.Desactivar();

        // Assert
        accion.Should().Throw<DomainException>()
            .WithMessage("*ya está inactivo*");
    }
}
```

## Plantilla: Test de Validator

```csharp
public class CrearUsuarioCommandValidatorTests
{
    private readonly CrearUsuarioCommandValidator _sut = new();

    [Fact]
    public void DebeSerValido_CuandoTodosLosCamposSonCorrectos()
    {
        var command = new CrearUsuarioCommand("Juan", "juan@email.com", "Pass1234");
        var resultado = _sut.Validate(command);
        resultado.IsValid.Should().BeTrue();
    }

    [Fact]
    public void DebeRetornarError_CuandoNombreEstaVacio()
    {
        var command = new CrearUsuarioCommand("", "juan@email.com", "Pass1234");
        var resultado = _sut.Validate(command);
        resultado.IsValid.Should().BeFalse();
        resultado.Errors.Should().Contain(e => e.PropertyName == "Nombre");
    }
}
```

## Paquetes de Test

```xml
<PackageReference Include="xunit" Version="2.*" />
<PackageReference Include="Moq" Version="4.*" />
<PackageReference Include="FluentAssertions" Version="6.*" />
<PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.*" />
```
