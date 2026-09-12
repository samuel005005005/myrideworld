# Template Python - Clean Architecture + FastAPI

## Fuente de estructura y convenciones

[`.cursor/rules/convention-python.mdc`](../../rules/convention-python.md)

Este archivo solo aporta **plantillas con placeholders**. Si hay conflicto, gana `estructuras/python.md`.

## Plantilla: Entidad

```python
from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4

@dataclass
class {Entidad}:
    """Entidad de dominio: {descripción}."""
    {campo}: {tipo}
    id: UUID = field(default_factory=uuid4)
    fecha_creacion: datetime = field(default_factory=datetime.utcnow)

    def __post_init__(self) -> None:
        # Validaciones de dominio
        if not self.{campo}:
            raise DomainException("{campo} es obligatorio.")

    def {comportamiento}(self) -> None:
        """Lógica de negocio."""
        pass
```

## Plantilla: Use Case

```python
from dataclasses import dataclass

@dataclass
class {NombreUseCase}:
    """{Descripción del caso de uso}."""
    {entidad}_repository: I{Entidad}Repository

    async def ejecutar(self, request: {Nombre}Request) -> {Nombre}Response:
        # 1. Validar reglas de negocio
        # 2. Crear/modificar entidad
        # 3. Persistir
        # 4. Retornar respuesta
        pass
```

## Plantilla: Repositorio (interfaz)

```python
from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

class I{Entidad}Repository(ABC):
    @abstractmethod
    async def obtener_por_id(self, id: UUID) -> Optional[{Entidad}]:
        ...

    @abstractmethod
    async def guardar(self, entidad: {Entidad}) -> {Entidad}:
        ...

    @abstractmethod
    async def eliminar(self, id: UUID) -> None:
        ...
```

## Plantilla: Router FastAPI

```python
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/{feature}", tags=["{Feature}"])

@router.post("/", response_model={Nombre}Response, status_code=status.HTTP_201_CREATED)
async def crear_{entidad}(
    request: {Nombre}Request,
    use_case: {NombreUseCase} = Depends(get_{nombre}_use_case),
) -> {Nombre}Response:
    try:
        return await use_case.ejecutar(request)
    except DomainException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
```

## Plantilla: Mappers

Los mappers garantizan que los modelos de SQLAlchemy nunca salgan de infraestructura y que las entidades de dominio nunca conozcan el ORM.

### Flujo de transformación

```
SQLAlchemy Model (infra) → Entidad (domain) → Response DTO (application)
Request DTO (application) → Entidad (domain) → SQLAlchemy Model (infra)
```

### Mapper de Infraestructura (Model ORM ↔ Entidad)

```python
# infrastructure/persistence/mappers/usuario_mapper.py

from domain.entities.usuario import Usuario
from domain.value_objects.email import Email
from infrastructure.persistence.models.usuario_model import UsuarioModel


class UsuarioPersistenceMapper:
    """Mapea entre el modelo SQLAlchemy y la entidad de dominio."""

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
    def to_model(entidad: Usuario) -> UsuarioModel:
        return UsuarioModel(
            id=entidad.id,
            nombre=entidad.nombre,
            email=str(entidad.email),
            estado=entidad.estado,
            fecha_creacion=entidad.fecha_creacion,
        )

    @staticmethod
    def to_domain_list(models: list[UsuarioModel]) -> list[Usuario]:
        return [UsuarioPersistenceMapper.to_domain(m) for m in models]
```

### Mapper de Aplicación (Entidad → Response DTO)

```python
# application/mappers/usuario_mapper.py

from domain.entities.usuario import Usuario
from application.dto.usuario_response import UsuarioResponse


class UsuarioApplicationMapper:
    """Mapea entre entidades de dominio y DTOs de aplicación."""

    @staticmethod
    def to_response(entidad: Usuario) -> UsuarioResponse:
        return UsuarioResponse(
            id=entidad.id,
            nombre=entidad.nombre,
            email=str(entidad.email),
            estado=entidad.estado,
            fecha_creacion=entidad.fecha_creacion,
        )

    @staticmethod
    def to_response_list(entidades: list[Usuario]) -> list[UsuarioResponse]:
        return [UsuarioApplicationMapper.to_response(e) for e in entidades]
```

### Uso en el Repositorio

```python
# infrastructure/persistence/repositories/usuario_repository_impl.py

class UsuarioRepositoryImpl(IUsuarioRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def obtener_por_id(self, id: UUID) -> Optional[Usuario]:
        model = await self._session.get(UsuarioModel, id)
        return UsuarioPersistenceMapper.to_domain(model) if model else None

    async def guardar(self, entidad: Usuario) -> Usuario:
        model = UsuarioPersistenceMapper.to_model(entidad)
        self._session.add(model)
        await self._session.flush()
        return entidad
```

### Uso en el Use Case

```python
class CrearUsuarioUseCase:
    usuario_repository: IUsuarioRepository

    async def ejecutar(self, request: CrearUsuarioRequest) -> UsuarioResponse:
        # Lógica de dominio...
        usuario = Usuario(nombre=request.nombre, email=Email(request.email))
        usuario_guardado = await self.usuario_repository.guardar(usuario)
        return UsuarioApplicationMapper.to_response(usuario_guardado)
```

### Reglas de Mappers

| Dirección | Ubicación | Responsable |
|-----------|-----------|-------------|
| Model ORM → Entidad | `infrastructure/persistence/mappers/` | Repositorio |
| Entidad → Model ORM | `infrastructure/persistence/mappers/` | Repositorio |
| Entidad → Response DTO | `application/mappers/` | Use Case |
| Request DTO → Entidad | Use Case directamente | Use Case |

### Qué NO hacer

- No importar SQLAlchemy models en la capa de aplicación ni dominio.
- No retornar entidades de dominio desde los endpoints (siempre DTO).
- No poner lógica de mapeo dentro de los modelos ORM.
- No usar `model_validate` de Pydantic para crear entidades de dominio (separar responsabilidades).

## Paquetes

- FastAPI, Pydantic v2, SQLAlchemy 2.0 + asyncpg, Alembic, dependency-injector, pytest + pytest-asyncio, ruff, mypy
