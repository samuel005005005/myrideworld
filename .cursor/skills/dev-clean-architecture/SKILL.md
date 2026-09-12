---
name: dev-clean-architecture
description: Scaffolding Clean Architecture multi-lenguaje: entidades, casos de uso, repositorios, controllers y tests. Use when creating project structure, CRUD features, or placing code in architecture layers.
---

# Clean Architecture

## Purpose

Skill integral para crear y mantener proyectos con Clean Architecture. Genera estructuras de proyecto, casos de uso, entidades, repositorios, controllers y tests siguiendo SOLID, DDD y las convenciones del equipo. Soporta múltiples lenguajes: .NET, Java, Kotlin, Python, TypeScript y Dart/Flutter.

## Use this skill when

- El usuario necesita crear un proyecto nuevo con Clean Architecture.
- El usuario pide generar un caso de uso, entidad, repositorio, controller o cualquier componente de la arquitectura.
- El usuario quiere scaffolding de una feature completa (todas las capas).
- El usuario necesita refactorizar código existente para cumplir Clean Architecture.
- El usuario pregunta dónde colocar algo dentro de la arquitectura.

Ejemplos:

- "Crear la estructura del proyecto."
- "Agregar una entidad Producto con sus campos."
- "Crear un caso de uso para registrar pedidos."
- "Generar el CRUD completo de clientes."
- "¿Dónde va esta lógica, en dominio o aplicación?"
- "Crear el repositorio para transacciones."
- "Scaffolding de la feature de pagos."

## Instructions

### 1. Detectar el Stack

Identificar el lenguaje revisando archivos del proyecto:

| Indicador | Stack | Template a usar |
|-----------|-------|-----------------|
| `*.csproj`, `Program.cs` | .NET (C#) | [`templates/dotnet.md`](templates/dotnet.md) |
| `pom.xml`, `build.gradle`, `*.java` | Java | [`templates/java.md`](templates/java.md) |
| `pubspec.yaml` | Dart/Flutter | [`templates/dart.md`](templates/dart.md) |
| `requirements.txt`, `pyproject.toml`, `*.py` | Python | [`templates/python.md`](templates/python.md) |
| `package.json` + `*.ts` | TypeScript | [`templates/typescript.md`](templates/typescript.md) |
| `build.gradle.kts`, `*.kt` | Kotlin | [`templates/kotlin.md`](templates/kotlin.md) |

Si no se puede determinar, preguntar al usuario.

### 2. Principios Obligatorios

Aplicar SOLID + Clean Architecture definidos en:

[`.cursor/rules/desarrollo-convenciones-desarrollo.mdc`](../../rules/desarrollo-convenciones-desarrollo.md)

Resumen operativo al generar:

- **Regla de Dependencia**: capas externas → internas, nunca al revés.
- **Dominio independiente**: sin frameworks, BD ni librerías externas.
- **DI por constructor** contra interfaces/abstracciones.
- **Un caso de uso = una operación**.
- **Una clase/interfaz pública por archivo** (ver `.cursor/rules/desarrollo-una-clase-por-archivo.mdc`).
- **Entidades con comportamiento** (no anémicas).
- **Errores tipados** de dominio.
- **Inmutabilidad** por defecto.

### 3. Capas

No redefinir el diagrama aquí: usar [`.cursor/rules/desarrollo-convenciones-desarrollo.mdc`](../../rules/desarrollo-convenciones-desarrollo.md).  
Árbol y convenciones del lenguaje: template correspondiente en `templates/`.

### 4. Operaciones Disponibles

Según lo que pida el usuario, generar:

#### Crear Entidad
- Archivo en capa de dominio
- Con validación interna, comportamiento, inmutabilidad
- Value Objects si hay campos con reglas de validación propias (email, money, etc.)

#### Crear Caso de Uso
- Archivo en capa de aplicación
- Recibe dependencias por constructor (interfaces)
- Retorna resultado tipado con manejo de errores
- DTOs de entrada y salida si aplica
- Validator si el lenguaje lo soporta (FluentValidation, Zod, Pydantic)

#### Crear Repositorio
- Interfaz en capa de dominio
- Implementación en capa de infraestructura/data
- Métodos con nomenclatura consistente: obtenerPorId, listarTodos, guardar, eliminar, existeX
- **Incluir Mapper** de infraestructura (Model ORM/DTO ↔ Entidad de Dominio)

#### Crear Mapper
- Mapper de infraestructura: transforma entre modelos de persistencia/API y entidades de dominio
- Mapper de aplicación: transforma entre entidades de dominio y DTOs de respuesta
- Mapper de presentación (opcional): transforma entidad a UI Model cuando la UI necesita datos derivados
- **Nunca** exponer entidades de dominio fuera de la capa de aplicación
- **Nunca** importar modelos de infraestructura en capas superiores

#### Crear Controller/Endpoint
- Archivo en capa de presentación
- Solo despacha a casos de uso (cero lógica de negocio)
- Validación de entrada en la frontera
- Respuestas HTTP/UI tipadas

#### Crear Feature Completa (scaffolding)
- Genera todas las capas de una feature de golpe:
  - Entidad + Value Objects
  - Interfaz de repositorio
  - Caso(s) de uso (CRUD o los que el usuario indique)
  - DTOs
  - Mappers (infraestructura + aplicación)
  - Controller/Page
  - Tests unitarios

#### Refactorizar a Clean Architecture
- Identificar violaciones (lógica en controller, acceso directo a BD, etc.)
- Proponer separación en capas
- Mover código manteniendo funcionalidad
- Crear interfaces para dependencias directas

### 5. Generación de Tests

Al generar componentes, crear tests con el skill de unit testing (no redefinir convenciones aquí):

[`../unit-testing/SKILL.md`](../unit-testing/SKILL.md)

Mínimo por componente: caso exitoso + al menos un error (validación / no encontrado / regla de negocio).

### 6. Checklist de Validación

Antes de entregar, verificar:

- [ ] Respeta la estructura de capas del proyecto existente
- [ ] Cada clase tiene una sola responsabilidad
- [ ] No hay dependencias de capas internas hacia externas
- [ ] Todas las dependencias son interfaces inyectadas
- [ ] Manejo de errores con tipos específicos
- [ ] Nombres descriptivos en el idioma del proyecto
- [ ] Tests cubren caso exitoso y al menos un error
- [ ] Archivos ubicados en la carpeta correcta de su capa
- [ ] No se duplica funcionalidad existente

### 7. Preguntar antes de generar

Si falta información, preguntar:

- Nombre de la entidad/feature
- Campos y tipos de datos
- Reglas de negocio específicas
- Si es un Command (mutación) o Query (lectura)
- ID del documento de documentación local para el commit (``)

## Output

El skill genera:

1. **Archivos de código** — en la ubicación correcta según la capa y convención del lenguaje
2. **Tests unitarios** — con cobertura de escenarios clave
3. **Resumen** — qué se creó, dónde se ubicó, y qué falta implementar (si algo)
