---
description: Convenciones FastAPI patrón empresa (dual-app, Cognito, SNS)
globs: **/main.py
alwaysApply: false
---
# Estructura Base - FastAPI (Patrón la empresa)

## Propósito

Estructura para APIs con FastAPI siguiendo el patrón real de la empresa. Incluye dual-app (external/internal), autenticación Cognito, bitácoras, procesos batch SNS, y acceso a servicios AWS via boto3.

---

## Estructura de Proyecto - FastAPI la empresa

```
📁 proyecto/
├── main.py                                # Entry point: monta sub-apps
│
├── 📁 services/                           # Composición de apps FastAPI
│   ├── api.py                             # App externa (/external) - clientes
│   └── portal.py                          # App interna (/internal) - backoffice
│
├── 📁 routers/                            # Endpoints por módulo
│   ├── 📁 api/                            # Routers de la app externa
│   │   ├── emision.py                     # Emisión de facturas
│   │   ├── consulta.py                    # Consultas
│   │   └── anulacion.py                   # Anulaciones
│   └── 📁 portal/                         # Routers de la app interna
│       ├── empresas.py
│       ├── usuarios.py
│       └── reportes.py
│
├── 📁 modelos/                            # Pydantic schemas (request/response)
│   ├── emision.py
│   ├── consulta.py
│   └── comunes.py
│
├── 📁 shared/                             # Utilidades compartidas
│   ├── 📁 auth/                           # Autenticación
│   │   ├── jwt_bearer.py                  # Validación JWT via Cognito JWKS
│   │   └── api_key_bearer.py             # Validación API Key via SSM
│   ├── 📁 psycopg/                        # Acceso a BD
│   │   ├── common.py                      # execute_query, insertar_bitacora, ejecucion_proceso
│   │   └── queries/                       # SQL por módulo
│   │       ├── emision.py
│   │       └── consulta.py
│   ├── constantes.py                      # ENTORNO dict, enums, BitacoraEvento, estados
│   ├── utils.py                           # get_secret_value, get_parameter, helpers
│   ├── excepciones.py                     # Excepciones custom + handlers
│   ├── middlewares.py                     # Logging de request/response
│   ├── cognito.py                         # Cliente Cognito (auth, create user, reset)
│   ├── simple_storage_service.py          # Cliente S3
│   ├── simple_notification_service.py     # Cliente SNS
│   └── dynamodb.py                        # Cliente DynamoDB (cross-account STS)
│
├── 📁 recursos/                           # IaC y recursos de deploy
│   └── 📁 cloudformation/                 # Templates CF (legado, migrar a CDK)
│       └── secret-manager.yaml
│
├── 📁 tests/
│   ├── conftest.py
│   ├── 📁 unit/
│   └── 📁 integration/
│
├── requirements.txt
├── Procfile                               # gunicorn + uvicorn workers
├── Dockerfile                             # Para ECS Fargate
└── .ebextensions/                         # Elastic Beanstalk (legado)
```

---

## Patrón de Entry Point (Dual-App)

```python
# main.py
import uvicorn
from fastapi import FastAPI
from services.api import app as api_app
from services.portal import app as portal_app

app = FastAPI()
app.mount("/external", api_app)
app.mount("/internal", portal_app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

## Patrón de Composición de App

```python
# services/api.py
from fastapi import FastAPI
from shared.excepciones import registrar_exception_handlers
from shared.middlewares import PathCaseInsensitiveMiddleware
from routers.api import emision, consulta, anulacion

app = FastAPI(title="API Externa", docs_url="/docs")

# Middlewares
app.add_middleware(PathCaseInsensitiveMiddleware)

# Exception handlers
registrar_exception_handlers(app)

# Routers
app.include_router(emision.router, prefix="/emision", tags=["Emisión"])
app.include_router(consulta.router, prefix="/consulta", tags=["Consulta"])
app.include_router(anulacion.router, prefix="/anulacion", tags=["Anulación"])
```

## Patrón de Autenticación

```python
# shared/auth/jwt_bearer.py — Validación via Cognito JWKS
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, jwk
import httpx

security = HTTPBearer()

async def verificar_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Valida JWT contra Cognito User Pool."""
    token = credentials.credentials
    # 1. Obtener JWKS de Cognito
    # 2. Verificar firma, expiración, issuer
    # 3. Retornar claims
    ...
```

```python
# shared/auth/api_key_bearer.py — Validación via Parameter Store
from fastapi import Header, HTTPException
from shared.utils import get_parameter

async def verificar_api_key(x_api_key: str = Header(...)) -> str:
    """Valida API key contra valor en SSM Parameter Store."""
    expected = get_parameter("/prod/mi-servicio/api-key-interna")
    if x_api_key != expected:
        raise HTTPException(status_code=401, detail="API key inválida")
    return x_api_key
```

## Patrón de Excepciones

```python
# shared/excepciones.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class FEException(Exception):
    """Excepción base del proyecto."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code


class BadRequestException(FEException):
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class NotFoundException(FEException):
    def __init__(self, message: str):
        super().__init__(message, status_code=404)


def registrar_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(FEException)
    async def fe_exception_handler(request: Request, exc: FEException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message},
        )
```

---

## Convenciones la empresa - FastAPI

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Archivos de routers | snake_case por módulo | `emision.py`, `consulta.py` |
| Modelos Pydantic | PascalCase | `EmisionRequest`, `FacturaResponse` |
| Funciones de BD | snake_case descriptivo | `insertar_bitacora_evento()` |
| Constantes/Enums | UPPER_SNAKE_CASE / PascalCase | `TipoEvento.INFO`, `ENTORNO` |
| Endpoints ocultos (batch) | `include_in_schema=False` | `@router.post("/proceso/...", include_in_schema=False)` |
| Apps | Montadas en `/external` y `/internal` | `app.mount("/external", api_app)` |

---

## Librerías del Stack la empresa

| Librería | Propósito |
|----------|-----------|
| `FastAPI` | Framework web async |
| `uvicorn` / `gunicorn` | Servidor ASGI |
| `pydantic` | Validación y schemas |
| `boto3` | AWS SDK (Secrets, SSM, S3, SNS, Cognito, DynamoDB) |
| `psycopg2-binary` | PostgreSQL driver |
| `python-jose` | JWT validation |
| `cryptography` | Operaciones criptográficas |
| `lxml` / `signxml` | XML processing y firma digital |
| `pandas` | Procesamiento de datos / reportes |
| `httpx` | HTTP client async |

---

## Reglas para el Agente

1. **Dual-app** (`/external` + `/internal`). No mezclar endpoints públicos con backoffice.
2. **Auth por Cognito JWT** para portal, **API Key por SSM** para integraciones externas.
3. **Bitácora en toda operación** que modifica datos (ver skill `bitacora-auditoria`).
4. **Procesos batch via SNS** con `include_in_schema=False` (ver skill `proceso-ejecucion`).
5. **Secrets Manager** para credentials de BD, **Parameter Store** para API keys y config.
6. **Config centralizada** en `shared/constantes.py` con dict `ENTORNO` por ambiente.
7. **Excepciones custom** que hereden de `FEException`. Handlers registrados en cada app.
8. **Queries SQL en `shared/psycopg/`**. No SQL inline en routers.
9. **No usar ORM** (patrón actual es psycopg2 directo con queries en archivos separados).
10. **Procfile para deploy**: `web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`.
