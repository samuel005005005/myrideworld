---
description: Convenciones Python Clean Architecture
globs: **/*.py
alwaysApply: false
---
# Estructura Base - Python con Clean Architecture

## Propósito

Define la estructura obligatoria para proyectos Python (FastAPI, Django, scripts) siguiendo Clean Architecture con tipado estricto. Se activa automáticamente al trabajar con archivos `.py`.

---

## Decisiones Obligatorias

| Decisión | Valor |
|----------|-------|
| Patrón base | Clean Architecture |
| Idioma del código (carpetas, clases, variables) | Español |
| Carpeta raíz del código | `src/` |
| Nombres de capas | `dominio/`, `aplicacion/`, `infraestructura/`, `presentacion/` |
| Convención de nombres | snake_case archivos, PascalCase clases, prefijo `I` para interfaces |
| Patrón FastAPI | Clean Architecture (NO patrón empresa dual-app) |
| Async/Sync | Sync (psycopg2 es sync) |
| Idioma de docstrings | Español |

---

## Estructura de Proyecto - FastAPI + Clean Arch

```
📁 src/
├── 📁 domain/                             # Capa de Dominio
│   ├── 📁 entities/
│   │   ├── __init__.py
│   │   ├── usuario.py                     # Entidad de dominio
│   │   └── pedido.py
│   ├── 📁 value_objects/
│   │   ├── __init__.py
│   │   └── email.py
│   ├── 📁 repositories/                   # Interfaces (ABC)
│   │   ├── __init__.py
│   │   └── usuario_repository.py
│   ├── 📁 services/                       # Servicios de dominio
│   │   └── __init__.py
│   ├── 📁 exceptions/
│   │   ├── __init__.py
│   │   └── domain_exceptions.py
│   └── 📁 events/
│       └── __init__.py
│
├── 📁 application/                        # Capa de Aplicación
│   ├── 📁 use_cases/
│   │   ├── __init__.py
│   │   ├── crear_usuario.py
│   │   ├── obtener_usuario.py
│   │   └── listar_usuarios.py
│   ├── 📁 dto/
│   │   ├── __init__.py
│   │   ├── usuario_request.py
│   │   └── usuario_response.py
│   ├── 📁 interfaces/                     # Interfaces de servicios externos
│   │   ├── __init__.py
│   │   └── email_service.py
│   └── 📁 mappers/
│       └── __init__.py
│
├── 📁 infrastructure/                     # Capa de Infraestructura
│   ├── 📁 persistence/
│   │   ├── __init__.py
│   │   ├── 📁 mappers/                    # Mapeadores ORM <-> Dominio
│   │   │   ├── __init__.py
│   │   │   └── usuario_orm_mapper.py
│   │   ├── 📁 models/                     # Modelos SQLAlchemy/Tortoise
│   │   │   └── usuario_model.py
│   │   ├── 📁 repositories/
│   │   │   └── usuario_repository_impl.py
│   │   ├── database.py                    # Configuración de BD
│   │   └── 📁 migrations/
│   ├── 📁 services/
│   │   ├── __init__.py
│   │   └── email_service_impl.py
│   └── 📁 config/
│       ├── __init__.py
│       └── settings.py                    # Pydantic Settings
│
├── 📁 presentation/                       # Capa de Presentación (API)
│   ├── 📁 api/
│   │   ├── __init__.py
│   │   ├── 📁 v1/
│   │   │   ├── __init__.py
│   │   │   ├── usuarios_router.py
│   │   │   └── pedidos_router.py
│   │   └── 📁 dependencies/              # Inyección de dependencias FastAPI
│   │       └── __init__.py
│   ├── 📁 middlewares/
│   │   └── __init__.py
│   └── 📁 schemas/                        # Schemas Pydantic de request/response
│       ├── __init__.py
│       └── usuario_schemas.py
│
├── main.py                                # Entry point FastAPI
└── container.py                           # Contenedor DI (dependency-injector)

📁 tests/
├── 📁 unit/
│   ├── 📁 domain/
│   └── 📁 application/
├── 📁 integration/
│   └── 📁 infrastructure/
└── conftest.py                            # Fixtures compartidas
```

---

## Patrones por Capa

### Dominio - Entidad

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from domain.exceptions.domain_exceptions import DomainException
from domain.value_objects.email import Email


@dataclass
class Usuario:
    """Entidad raíz del agregado Usuario."""

    nombre: str
    email: Email
    id: UUID = field(default_factory=uuid4)
    estado: str = "activo"
    fecha_creacion: datetime = field(default_factory=datetime.utcnow)

    def __post_init__(self) -> None:
        if not self.nombre.strip():
            raise DomainException("El nombre no puede estar vacío.")

    def desactivar(self) -> None:
        if self.estado == "inactivo":
            raise DomainException("El usuario ya está inactivo.")
        self.estado = "inactivo"

    def cambiar_email(self, nuevo_email: Email) -> None:
        if self.email == nuevo_email:
            raise DomainException("El nuevo email es igual al actual.")
        self.email = nuevo_email
```

### Dominio - Value Object

```python
from dataclasses import dataclass
import re

from domain.exceptions.domain_exceptions import DomainException


@dataclass(frozen=True)
class Email:
    """Value Object para email validado."""

    valor: str

    def __post_init__(self) -> None:
        patron = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(patron, self.valor):
            raise DomainException(f"Email inválido: {self.valor}")

    def __str__(self) -> str:
        return self.valor
```

### Dominio - Interfaz de Repositorio

```python
from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from domain.entities.usuario import Usuario


class IUsuarioRepository(ABC):
    """Puerto de salida para persistencia de usuarios."""

    @abstractmethod
    async def obtener_por_id(self, id: UUID) -> Optional[Usuario]:
        ...

    @abstractmethod
    async def obtener_por_email(self, email: str) -> Optional[Usuario]:
        ...

    @abstractmethod
    async def listar_todos(self, limit: int = 50, offset: int = 0) -> list[Usuario]:
        ...

    @abstractmethod
    async def guardar(self, usuario: Usuario) -> Usuario:
        ...

    @abstractmethod
    async def eliminar(self, id: UUID) -> None:
        ...

    @abstractmethod
    async def existe_email(self, email: str) -> bool:
        ...
```

### Aplicación - Caso de Uso

```python
from dataclasses import dataclass
from uuid import UUID

from domain.entities.usuario import Usuario
from domain.exceptions.domain_exceptions import DomainException
from domain.repositories.usuario_repository import IUsuarioRepository
from domain.value_objects.email import Email
from application.dto.usuario_request import CrearUsuarioRequest
from application.dto.usuario_response import UsuarioResponse


@dataclass
class CrearUsuarioUseCase:
    """Caso de uso: Crear un nuevo usuario."""

    usuario_repository: IUsuarioRepository

    async def ejecutar(self, request: CrearUsuarioRequest) -> UsuarioResponse:
        if await self.usuario_repository.existe_email(request.email):
            raise DomainException("El email ya está registrado.")

        email = Email(request.email)
        usuario = Usuario(nombre=request.nombre, email=email)

        usuario_guardado = await self.usuario_repository.guardar(usuario)

        return UsuarioResponse.from_entity(usuario_guardado)
```

### Aplicación - DTOs (Pydantic)

```python
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime

from domain.entities.usuario import Usuario


class CrearUsuarioRequest(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100, description="Nombre del usuario")
    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=8, description="Contraseña")


class UsuarioResponse(BaseModel):
    id: UUID
    nombre: str
    email: str
    estado: str
    fecha_creacion: datetime

    @classmethod
    def from_entity(cls, usuario: Usuario) -> "UsuarioResponse":
        return cls(
            id=usuario.id,
            nombre=usuario.nombre,
            email=str(usuario.email),
            estado=usuario.estado,
            fecha_creacion=usuario.fecha_creacion,
        )

    class Config:
        from_attributes = True
```

### Infraestructura - Persistencia (Mappers)

```python
# infrastructure/persistence/mappers/usuario_orm_mapper.py

from domain.entities.usuario import Usuario
from domain.value_objects.email import Email
from infrastructure.persistence.models.usuario_model import UsuarioModel


class UsuarioOrmMapper:
    """Mapea entre la entidad de dominio y el modelo ORM."""

    @staticmethod
    def to_domain(model: UsuarioModel) -> Usuario:
        return Usuario(
            id=model.id,
            nombre=model.nombre,
            email=Email(model.email),
            estado=model.estado,
            fecha_creacion=model.fecha_creacion,
        )

    @staticmethod
    def to_orm(domain: Usuario) -> UsuarioModel:
        return UsuarioModel(
            id=domain.id,
            nombre=domain.nombre,
            email=str(domain.email),
            estado=domain.estado,
            fecha_creacion=domain.fecha_creacion,
        )
```

### Infraestructura - Repositorio

```python
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from domain.entities.usuario import Usuario
from domain.repositories.usuario_repository import IUsuarioRepository
from domain.value_objects.email import Email
from infrastructure.persistence.models.usuario_model import UsuarioModel
from infrastructure.persistence.mappers.usuario_orm_mapper import UsuarioOrmMapper

class UsuarioRepositoryImpl(IUsuarioRepository):
    """Implementación del repositorio con SQLAlchemy."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def obtener_por_id(self, id: UUID) -> Optional[Usuario]:
        result = await self._session.get(UsuarioModel, id)
        return UsuarioOrmMapper.to_domain(result) if result else None

    async def guardar(self, usuario: Usuario) -> Usuario:
        model = UsuarioOrmMapper.to_orm(usuario)
        self._session.add(model)
        await self._session.flush()
        return usuario

    async def existe_email(self, email: str) -> bool:
        stmt = select(UsuarioModel).where(UsuarioModel.email == email)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None

    # ... demás métodos
```

### Presentación - Router FastAPI

```python
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from application.use_cases.crear_usuario import CrearUsuarioUseCase
from application.use_cases.obtener_usuario import ObtenerUsuarioUseCase
from application.dto.usuario_request import CrearUsuarioRequest
from application.dto.usuario_response import UsuarioResponse
from domain.exceptions.domain_exceptions import DomainException
from presentation.api.dependencies import get_crear_usuario_use_case, get_obtener_usuario_use_case

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def crear_usuario(
    request: CrearUsuarioRequest,
    use_case: CrearUsuarioUseCase = Depends(get_crear_usuario_use_case),
) -> UsuarioResponse:
    """Crea un nuevo usuario."""
    try:
        return await use_case.ejecutar(request)
    except DomainException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{usuario_id}", response_model=UsuarioResponse)
async def obtener_usuario(
    usuario_id: UUID,
    use_case: ObtenerUsuarioUseCase = Depends(get_obtener_usuario_use_case),
) -> UsuarioResponse:
    """Obtiene un usuario por ID."""
    try:
        return await use_case.ejecutar(usuario_id)
    except DomainException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
```

---

## Librerías Recomendadas

| Librería | Propósito |
|----------|-----------|
| `FastAPI` | Framework web async |
| `Pydantic` v2 | Validación y schemas |
| `SQLAlchemy` 2.0 + `asyncpg` | ORM async |
| `Alembic` | Migraciones de BD |
| `dependency-injector` | Contenedor DI |
| `pytest` + `pytest-asyncio` | Testing |
| `httpx` | Cliente HTTP async / test client |
| `structlog` | Logging estructurado |
| `ruff` | Linter + formatter |
| `mypy` | Verificación de tipos estáticos |

---

## Convenciones de Nomenclatura Python

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Módulos/archivos | snake_case | `usuario_repository.py` |
| Clases | PascalCase | `UsuarioRepository` |
| Interfaces/ABC | PascalCase con prefijo `I` | `IUsuarioRepository` |
| Funciones/métodos | snake_case | `obtener_por_id()` |
| Variables | snake_case | `nombre_completo` |
| Constantes | UPPER_SNAKE_CASE | `MAX_REINTENTOS` |
| Paquetes | snake_case | `domain.entities` |
| DTOs | PascalCase + sufijo descriptivo | `CrearUsuarioRequest` |
| Use Cases | PascalCase + UseCase | `CrearUsuarioUseCase` |

---

## Reglas para el Agente

1. **Type hints siempre**. Toda función debe tener anotaciones de tipo en parámetros y retorno.
2. **`async/await`** para operaciones I/O. No usar código síncrono bloqueante en contextos async.
3. **Pydantic para validación** en la frontera (request/response). Entidades de dominio usan `dataclass`.
4. **ABC para interfaces**. Los repositorios y servicios externos se definen como clases abstractas.
5. **Un caso de uso por archivo**. Método principal: `ejecutar()` o `__call__()`.
6. **Docstrings** en clases y funciones públicas (formato Google o NumPy).
7. **No usar `Any`** salvo justificación explícita. Prefiere tipos específicos o `Protocol`.
8. **Imports absolutos** desde la raíz del proyecto. No usar imports relativos.
9. **Manejo de errores** con excepciones de dominio tipadas, nunca `Exception` genérica.
10. **Tests con pytest**. Usa fixtures, parametrize, y async fixtures para tests de integración.
11. **Mappers ORM separados**. La lógica de transformación entre modelos ORM y Entidades de Dominio (`to_domain`, `to_orm`) debe estar en clases estáticas/exclusivas dentro de `infrastructure/persistence/mappers/` y NO como métodos privados dentro del Repositorio.
