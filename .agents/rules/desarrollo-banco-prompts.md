---
description: Banco de prompts validados del equipo — modo desarrollo
alwaysApply: false
---
# Banco de Prompts Validados

## Propósito

Este documento contiene prompts que el equipo ha probado, refinado y aprobado como efectivos para tareas comunes. Sirve como referencia rápida y asegura consistencia en la interacción con el agente.

---

## Cómo Usar Este Banco

1. Busca el prompt por categoría.
2. Copia y adapta al contexto específico de tu tarea.
3. Si descubres un prompt mejor, proponlo al equipo para agregarlo aquí.

## Cómo Agregar un Prompt

- Debe haber sido probado al menos 2 veces con resultado satisfactorio.
- Incluir: categoría, descripción, el prompt, y ejemplo de resultado esperado.
- Obtener aprobación del equipo antes de agregarlo como "validado".

---

## Categoría: Creación de Features

### Prompt: Crear endpoint CRUD completo

**Cuándo usar:** Al iniciar un nuevo recurso/entidad con operaciones básicas.

```
Necesito crear un CRUD completo para la entidad [NOMBRE_ENTIDAD] con los campos:
- [campo1]: [tipo] (obligatorio/opcional)
- [campo2]: [tipo] (obligatorio/opcional)

Requerimientos:
- Seguir la estructura de Clean Architecture del proyecto
- Incluir validaciones en la capa de aplicación
- Crear la interfaz del repositorio en dominio
- Implementar el repositorio en infraestructura
- Endpoints: GET (lista paginada), GET by ID, POST, PUT, DELETE
- DTOs de request y response separados
```

---

### Prompt: Crear caso de uso específico

**Cuándo usar:** Para lógica de negocio que no es un simple CRUD.

```
Implementar el caso de uso: [DESCRIPCIÓN DEL CASO DE USO]

Contexto de negocio:
- [Regla de negocio 1]
- [Regla de negocio 2]

Flujo esperado:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

Casos de error:
- Si [condición], retornar [error específico]

Tarea: 
```

---

## Categoría: Corrección de Bugs

### Prompt: Investigar y corregir bug

**Cuándo usar:** Cuando tienes un error reportado y necesitas que el agente lo investigue.

```
Bug reportado: [DESCRIPCIÓN DEL BUG]

Comportamiento esperado: [QUÉ DEBERÍA PASAR]
Comportamiento actual: [QUÉ ESTÁ PASANDO]

Pasos para reproducir:
1. [Paso 1]
2. [Paso 2]

Archivos posiblemente relacionados: [ARCHIVOS SI LOS CONOCES]

Investigar la causa raíz, proponer solución y aplicar el fix.
Tarea: 
```

---

## Categoría: Refactorización

### Prompt: Refactorizar a Clean Architecture

**Cuándo usar:** Cuando hay código legacy que necesita restructurarse.

```
Refactorizar [ARCHIVO/MÓDULO] para cumplir con Clean Architecture:

Problemas actuales:
- [Problema 1: ej. lógica de negocio en el controller]
- [Problema 2: ej. acceso directo a BD sin repositorio]

Resultado esperado:
- Separar en capas: Dominio, Aplicación, Infraestructura
- Crear interfaces para las dependencias
- Mover lógica de negocio al dominio o caso de uso
- Mantener el comportamiento funcional idéntico

No cambiar: [COSAS QUE NO DEBEN TOCARSE]
Tarea: 
```

---

### Prompt: Extraer servicio

**Cuándo usar:** Cuando una clase tiene demasiadas responsabilidades.

```
La clase [NOMBRE_CLASE] viola SRP. Tiene las siguientes responsabilidades:
1. [Responsabilidad 1]
2. [Responsabilidad 2]
3. [Responsabilidad 3]

Extraer [Responsabilidad X] a un servicio dedicado llamado [NOMBRE_SUGERIDO].
Mantener la funcionalidad intacta y actualizar las dependencias.
Tarea: 
```

---

## Categoría: Testing

### Prompt: Generar tests unitarios

**Cuándo usar:** Para cubrir una clase o módulo con tests.  
Usar el skill `unit-testing` (`.agents/skills/unit-testing/SKILL.md`) como fuente de convenciones.

```
Generar tests unitarios para [CLASE/MÓDULO] siguiendo el skill unit-testing:

Cubrir:
- Caso exitoso: [descripción]
- Validación fallida / no encontrado / regla de negocio: [descripción]
- [Caso edge: descripción]

Tarea: 
```

---

## Categoría: Documentación

### Prompt: Documentar endpoint/API

**Cuándo usar:** Para generar o actualizar documentación de API.

```
Documentar el endpoint [MÉTODO] [RUTA]:

Incluir:
- Descripción de qué hace
- Parámetros de entrada (query params, body, path params)
- Respuestas posibles (200, 400, 401, 404, 500) con ejemplo de body
- Ejemplo de request con curl
- Permisos requeridos

Formato: [Swagger/OpenAPI / Markdown]
Tarea: 
```

---

## Categoría: Base de Datos

### Prompt: Crear migración

**Cuándo usar:** Para cambios en el esquema de la base de datos.

```
Crear migración para: [DESCRIPCIÓN DEL CAMBIO]

Cambios requeridos:
- [Agregar tabla / columna / índice / constraint]
- [Modificar tipo de dato / nombre]
- [Eliminar elemento]

Consideraciones:
- La migración debe ser reversible (incluir rollback)
- No debe causar downtime en producción
- Si hay datos existentes, incluir script de transformación

Tarea: 
```

---

## Categoría: DevOps / CI-CD

### Prompt: Configurar pipeline

**Cuándo usar:** Para crear o modificar pipelines de CI/CD.

```
Configurar pipeline de [CI/CD] para:

Etapas requeridas:
1. [Build]
2. [Test (unitarios + integración)]
3. [Análisis estático / linting]
4. [Build de contenedor]
5. [Deploy a ambiente: X]

Plataforma: [GitHub Actions / Azure Pipelines / Jenkins]
Triggers: [push a develop, PR a main, tag de release]
Secretos necesarios: [listar sin valores]

Tarea: 
```

---

## Registro de Cambios del Banco

| Fecha | Prompt | Acción | Aprobado por |
|-------|--------|--------|--------------|
| <!-- TODO --> | <!-- TODO --> | Agregado / Modificado / Eliminado | <!-- TODO --> |

---

## Reglas para el Agente

1. **Consulta este banco** cuando el usuario pida algo que coincida con una categoría existente.
2. **Sugiere prompts de este banco** cuando detectes que el usuario podría beneficiarse de uno.
3. **Propón agregar prompts** al banco cuando un prompt nuevo resulte particularmente efectivo.
4. **No modifiques prompts existentes** sin confirmación del usuario.
5. **Mantén el formato** consistente al agregar nuevas entradas.
