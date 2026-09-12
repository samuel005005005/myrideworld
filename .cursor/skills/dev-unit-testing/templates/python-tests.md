# Template Tests - Python (pytest + pytest-asyncio)

## Fuente de ubicación

Estructura del proyecto: [`.cursor/rules/convention-python.mdc`](../../rules/convention-python.md)  
Convenciones de tests: skill `unit-testing`.

## Estructura

```
tests/
├── unit/
│   ├── domain/
│   │   └── test_usuario.py
│   └── application/
│       └── test_crear_usuario.py
├── integration/
│   └── infrastructure/
│       └── test_usuario_repository.py
└── conftest.py
```

## Plantilla: Test de Use Case

```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

from domain.entities.usuario import Usuario
from domain.value_objects.email import Email
from domain.exceptions.domain_exceptions import DomainException
from application.use_cases.crear_usuario import CrearUsuarioUseCase
from application.dto.usuario_request import CrearUsuarioRequest


@pytest.fixture
def mock_repository() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def sut(mock_repository: AsyncMock) -> CrearUsuarioUseCase:
    return CrearUsuarioUseCase(usuario_repository=mock_repository)


class TestCrearUsuarioUseCase:
    """Tests para el caso de uso CrearUsuario."""

    @pytest.mark.asyncio
    async def test_debe_crear_usuario_cuando_datos_son_validos(
        self, sut: CrearUsuarioUseCase, mock_repository: AsyncMock
    ) -> None:
        # Arrange
        request = CrearUsuarioRequest(
            nombre="Juan Pérez",
            email="juan@email.com",
            password="Pass1234",
        )
        mock_repository.existe_email.return_value = False
        mock_repository.guardar.return_value = Usuario(
            nombre="Juan Pérez",
            email=Email("juan@email.com"),
        )

        # Act
        resultado = await sut.ejecutar(request)

        # Assert
        assert resultado.nombre == "Juan Pérez"
        assert resultado.email == "juan@email.com"
        mock_repository.guardar.assert_called_once()

    @pytest.mark.asyncio
    async def test_debe_lanzar_excepcion_cuando_email_ya_registrado(
        self, sut: CrearUsuarioUseCase, mock_repository: AsyncMock
    ) -> None:
        # Arrange
        request = CrearUsuarioRequest(
            nombre="Juan Pérez",
            email="existente@email.com",
            password="Pass1234",
        )
        mock_repository.existe_email.return_value = True

        # Act & Assert
        with pytest.raises(DomainException, match="ya está registrado"):
            await sut.ejecutar(request)

        mock_repository.guardar.assert_not_called()

    @pytest.mark.asyncio
    async def test_debe_lanzar_excepcion_cuando_repositorio_falla(
        self, sut: CrearUsuarioUseCase, mock_repository: AsyncMock
    ) -> None:
        # Arrange
        request = CrearUsuarioRequest(
            nombre="Juan Pérez",
            email="juan@email.com",
            password="Pass1234",
        )
        mock_repository.existe_email.return_value = False
        mock_repository.guardar.side_effect = Exception("Error de conexión")

        # Act & Assert
        with pytest.raises(Exception, match="Error de conexión"):
            await sut.ejecutar(request)
```

## Plantilla: Test de Entidad

```python
import pytest

from domain.entities.usuario import Usuario
from domain.value_objects.email import Email
from domain.exceptions.domain_exceptions import DomainException


class TestUsuario:
    """Tests para la entidad Usuario."""

    def test_debe_crear_usuario_cuando_datos_son_validos(self) -> None:
        # Act
        usuario = Usuario(nombre="Juan Pérez", email=Email("juan@email.com"))

        # Assert
        assert usuario.nombre == "Juan Pérez"
        assert str(usuario.email) == "juan@email.com"
        assert usuario.estado == "activo"

    def test_debe_lanzar_excepcion_cuando_nombre_esta_vacio(self) -> None:
        # Act & Assert
        with pytest.raises(DomainException, match="nombre"):
            Usuario(nombre="", email=Email("juan@email.com"))

    def test_debe_desactivar_usuario_cuando_esta_activo(self) -> None:
        # Arrange
        usuario = Usuario(nombre="Juan Pérez", email=Email("juan@email.com"))

        # Act
        usuario.desactivar()

        # Assert
        assert usuario.estado == "inactivo"

    def test_debe_lanzar_excepcion_cuando_desactiva_usuario_ya_inactivo(self) -> None:
        # Arrange
        usuario = Usuario(nombre="Juan Pérez", email=Email("juan@email.com"))
        usuario.desactivar()

        # Act & Assert
        with pytest.raises(DomainException, match="ya está inactivo"):
            usuario.desactivar()
```

## Plantilla: conftest.py

```python
import pytest
from unittest.mock import AsyncMock


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"
```

## Paquetes de Test

```
pytest>=7.0
pytest-asyncio>=0.21
pytest-cov>=4.0
```
