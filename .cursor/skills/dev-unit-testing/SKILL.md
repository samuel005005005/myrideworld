---
name: dev-unit-testing
description: Genera tests unitarios AAA con mocks y naming en español según el stack (.NET, Dart, Python, TypeScript, Kotlin, Java). Use when the user asks for tests, coverage, or to verify behavior before delivery.
---

# Unit Testing

## Purpose

Skill para generar tests unitarios completos, consistentes y con buena cobertura. Detecta el stack del proyecto, identifica qué testear, genera mocks de dependencias y produce tests con nomenclatura en español siguiendo las convenciones del equipo.

## Use this skill when

- El usuario pide crear tests unitarios para una clase, caso de uso, servicio o entidad.
- El usuario pide cubrir un módulo con tests.
- El usuario pide verificar que algo funciona antes de entregar.
- El usuario menciona "testear", "probar", "cubrir con tests", "agregar pruebas".

Ejemplos:

- "Agregar tests al caso de uso CrearUsuario."
- "Testear la entidad Pedido."
- "Cubrir el controller de pagos con tests."
- "Crear pruebas unitarias para el repositorio de clientes."
- "Necesito tests para esta clase."

## Instructions

### 1. Detectar el Stack y Framework de Testing

| Indicador | Stack | Framework de test | Template |
|-----------|-------|-------------------|----------|
| `*.csproj` | .NET | xUnit + Moq/NSubstitute + FluentAssertions | [`templates/dotnet-tests.md`](templates/dotnet-tests.md) |
| `pubspec.yaml` | Dart/Flutter | flutter_test + mocktail | [`templates/dart-tests.md`](templates/dart-tests.md) |
| `pyproject.toml`, `requirements.txt` | Python | pytest + pytest-asyncio + unittest.mock | [`templates/python-tests.md`](templates/python-tests.md) |
| `package.json` + `*.ts` | TypeScript | Jest o Vitest | [`templates/typescript-tests.md`](templates/typescript-tests.md) |
| `build.gradle.kts`, `*.kt` | Kotlin | JUnit5 + MockK | [`templates/kotlin-tests.md`](templates/kotlin-tests.md) |
| `pom.xml`, `*.java` | Java | JUnit5 + Mockito | [`templates/java-tests.md`](templates/java-tests.md) |

Ubicación de carpetas de test: seguir `.cursor/rules/{lenguaje}.md` del stack; este skill y sus templates definen **cómo** escribir los tests.

### 2. Identificar qué testear

Antes de escribir tests, analizar la clase objetivo:

- **Dependencias externas** → se mockean
- **Métodos públicos** → se testean
- **Caminos de ejecución** → cada if/else/throw es un escenario
- **Reglas de negocio** → escenario positivo y negativo por cada regla
- **Edge cases** → nulls, listas vacías, valores límite, concurrencia

### 3. Estructura de cada test

Todos los tests siguen **Arrange / Act / Assert**:

```
// Arrange: preparar datos y mocks
// Act: ejecutar la operación
// Assert: verificar resultado
```

### 4. Nomenclatura de Tests (español)

Formato: `Debe{Resultado}_Cuando{Condición}`

Ejemplos:
- `DebeRetornarUsuario_CuandoIdExiste`
- `DebeLanzarExcepcion_CuandoEmailYaRegistrado`
- `DebeRetornarListaVacia_CuandoNoHayRegistros`
- `DebeDesactivarUsuario_CuandoEstadoEsActivo`
- `DebeRetornarError_CuandoNombreEstaVacio`

### 5. Escenarios Mínimos Obligatorios

Para cada componente, cubrir al menos:

#### Para Casos de Uso / Servicios:
| # | Escenario | Qué validar |
|---|-----------|-------------|
| 1 | Caso exitoso | Retorna resultado esperado |
| 2 | Validación fallida | Lanza error con input inválido |
| 3 | Entidad no encontrada | Maneja ID inexistente correctamente |
| 4 | Regla de negocio violada | Detecta condición y retorna error |
| 5 | Dependencia falla | Maneja error del repositorio/servicio |

#### Para Entidades:
| # | Escenario | Qué validar |
|---|-----------|-------------|
| 1 | Creación válida | Se crea con todos los campos correctos |
| 2 | Validación de campos | Rechaza datos inválidos |
| 3 | Comportamiento | Métodos producen el estado esperado |
| 4 | Invariantes | No permite estados inconsistentes |

#### Para Controllers/Endpoints (integración ligera):
| # | Escenario | Qué validar |
|---|-----------|-------------|
| 1 | Request válido | Retorna status code correcto + body |
| 2 | Request inválido | Retorna 400 con mensaje de error |
| 3 | Recurso no encontrado | Retorna 404 |
| 4 | Error interno | Retorna 500 genérico (no expone detalles) |

### 6. Generar según el stack

Usar el template correspondiente para la estructura de archivos y estilo de código:

- .NET → [`templates/dotnet-tests.md`](templates/dotnet-tests.md)
- Dart/Flutter → [`templates/dart-tests.md`](templates/dart-tests.md)
- Python → [`templates/python-tests.md`](templates/python-tests.md)
- TypeScript → [`templates/typescript-tests.md`](templates/typescript-tests.md)
- Kotlin → [`templates/kotlin-tests.md`](templates/kotlin-tests.md)

### 7. Reglas de Calidad

- **No testear implementaciones internas**, solo comportamiento público.
- **Un assert lógico por test** (puede tener múltiples asserts si validan la misma cosa).
- **Tests independientes** — no dependen de orden de ejecución ni de estado compartido mutable.
- **Datos de test explícitos** — no generar datos random. Valores claros y descriptivos.
- **Mocks mínimos** — solo mockear lo necesario, no toda la clase.
- **No testear getters/setters triviales** ni código de framework.
- **Si el test es difícil de escribir**, la clase probablemente viola SRP. Sugerirlo al usuario.

### 8. Ubicación de archivos de test

| Stack | Ubicación | Nomenclatura |
|-------|-----------|--------------|
| .NET | `tests/{Proyecto}.Tests/{Feature}/` | `{Clase}Tests.cs` |
| Dart | `test/features/{feature}/{capa}/` | `{clase}_test.dart` |
| Python | `tests/unit/{capa}/` | `test_{modulo}.py` |
| TypeScript | `tests/unit/` o `__tests__/` | `{nombre}.spec.ts` |
| Kotlin | `src/test/kotlin/.../` | `{Clase}Test.kt` |

## Output

El skill genera:

1. **Archivo(s) de test** — en la ubicación correcta del proyecto
2. **Mocks/Fakes necesarios** — si no existen en el proyecto
3. **Resumen de cobertura** — tabla con escenarios cubiertos
4. **Sugerencias** — si detecta que faltan tests o la clase es difícil de testear
