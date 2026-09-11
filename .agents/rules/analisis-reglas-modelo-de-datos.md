---
description: Reglas para modelos de datos lógicos (código/API)
alwaysApply: false
---
# Reglas para Modelos de Datos (Artefacto: Modelo de Datos)

Este steering define las reglas que aplican cuando se trabaja con **Modelos de Datos** como artefactos locales en `docs/analisis/`. Un Modelo de Datos es la representación lógica de una entidad orientada al lenguaje de programación principal del proyecto (no a la base de datos).

> **Diferencia clave:**
> - **Estructura de Datos** = representación física (BD), nomenclatura snake_case, tipos de BD.
> - **Modelo de Datos** = representación lógica (código/API), nomenclatura camelCase, tipos del lenguaje de programación.

---

## Lenguaje de Programación Principal

El lenguaje base del proyecto es **Python**. Todos los tipos de datos del modelo se expresan en tipos nativos de Python.

### Tabla de mapeo de tipos (Python)

| Concepto | Tipo en Modelo de Datos | Notas |
|----------|------------------------|-------|
| Identificador numérico (PK/FK) | `int` | Nunca string/UUID salvo que el negocio lo exija explícitamente |
| Texto corto | `str` | Indicar longitud máxima |
| Texto largo | `str` | Indicar longitud máxima o "N/A" si ilimitado |
| Fecha con hora | `datetime` | Usar `datetime` de Python |
| Fecha sin hora | `date` | Usar `date` de Python |
| Booleano | `bool` | |
| Decimal / moneda | `Decimal` | Indicar precisión |
| Lista / colección | `list[T]` | Indicar tipo interno |
| Opcional | `Optional[T]` | Cuando el campo no es requerido y puede ser None |

---

## Reglas de Nomenclatura

### 1. Título del archivo y nombre del modelo
El nombre del archivo (derivado a PascalCase) y el campo "Nombre" dentro del body **deben ser idénticos** y van en **PascalCase**.

**Formato:** `NombreEntidad` (sin prefijo "Modelo de Datos -")

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `Usuario` | `Modelo de Datos - Usuario` |
| `BitacoraEvento` | `Modelo de Datos - bitacora_evento` |
| `TipoOperacion` | `tipo_operacion` |
| `EjecucionProceso` | `ejecucion_proceso` |

La carpeta `modelos-datos/` ya identifica que es un modelo, por lo que el título no necesita el prefijo.

### 2. Nombres de campos
Todos los nombres de campos del modelo van en **camelCase**.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `usuarioId` | `usuario_id` |
| `primerApellido` | `primer_apellido` |
| `fechaCreacion` | `fecha_creacion` |
| `entidadId` | `entidad_id` |

### 3. Nombre del campo ID (PK)
El campo identificador sigue el patrón: `nombreEntidadId`

| Entidad | Campo ID |
|---------|----------|
| usuario | `usuarioId` |
| bitacoraEvento | `bitacoraEventoId` |
| tipoOperacion | `tipoOperacionId` |

---

## Descripción del Body (cuerpo del documento Markdown)

### Regla de contenido
La descripción solo debe contener una **frase corta** que indique el propósito funcional del modelo. NO incluir detalles técnicos como el lenguaje, la nomenclatura, ni información sobre la BD.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| "Modelo de datos lógico de la entidad Usuario." | "Modelo de datos lógico de la entidad Usuario (camelCase para API)." |
| "Representa la información de un evento de bitácora del sistema." | "Modelo Python con camelCase para el servicio REST de bitácora." |

---

## Campos Obligatorios del Modelo

### Campos de auditoría (SIEMPRE presentes en modelos transaccionales)

| Nombre | Tipo | Longitud | Req. | Consideración |
|--------|------|----------|------|---------------|
| `usuarioCreacionId` | `int` | 5 | Sí | Usuario que creó el registro. |
| `usuarioUltimoCambioId` | `int` | 5 | No | Usuario que actualizó el registro. |
| `fechaCreacion` | `datetime` | N/A | Sí | Fecha de creación del registro. |
| `fechaUltimoCambio` | `datetime` | N/A | No | Fecha de actualización del registro. |

### Campo estado (cuando aplique soft-delete o estados)

| Nombre | Tipo | Longitud | Req. | Consideración |
|--------|------|----------|------|---------------|
| `estado` | `str` | 2 | Sí | Estado del registro. **Posibles Valores:** AC=Activo, IN=Inactivo |

### Campo entidadId (cuando aplique pertenencia a entidad)

| Nombre | Tipo | Longitud | Req. | Consideración |
|--------|------|----------|------|---------------|
| `entidadId` | `int` | 5 | Sí/No* | Código que identifica la entidad del sistema. |

*Evaluar si aplica según el contexto multi-tenant.

---

## Tipos de Datos: Regla General

> **Los tipos de datos del modelo se determinan por el lenguaje de programación principal del proyecto, NO por el motor de base de datos.**

- Si el proyecto es Python → tipos de Python (`int`, `str`, `datetime`, `bool`, `Decimal`, `list`, `Optional`)
- Si fuera Java → tipos de Java (`Long`, `String`, `LocalDateTime`, `Boolean`, `BigDecimal`, `List<T>`)
- Si fuera TypeScript → tipos de TypeScript (`number`, `string`, `Date`, `boolean`)

### El ID siempre es `int` (para Python)
- No usar `str` ni UUID para identificadores numéricos autoincrementales.
- Solo usar `str` para el ID si el negocio requiere explícitamente un identificador alfanumérico (ej: código externo de un sistema legacy).

---

## Relación entre Modelo de Datos y Estructura de Datos

| Aspecto | Modelo de Datos | Estructura de Datos |
|---------|----------------|-------------------|
| Propósito | Representación en código/API | Representación en BD |
| Nomenclatura campos | camelCase | snake_case |
| Tipos | Del lenguaje (Python) | Del motor de BD (PostgreSQL/Oracle) |
| Título documento | PascalCase (`Usuario`) | snake_case (`usuario`) |
| Nombre en body | PascalCase (`Usuario`) | snake_case (`usuario`) |
| ID | `int` | `bigint` / `bigserial` |
| documento Type | `Modelo de Datos` | `Estructuras de Datos` |

### Consistencia obligatoria
Si un modelo de datos tiene un campo, su estructura de datos correspondiente **debe tener el campo equivalente** (con nombre en snake_case y tipo de BD). Ambos artefactos deben mantenerse sincronizados.

---

## Checklist de calidad para Modelos de Datos

- [ ] ¿El título está en PascalCase (ej: `Usuario`, `BitacoraEvento`) sin prefijo?
- [ ] ¿El nombre del modelo en el body es idéntico al título (PascalCase)?
- [ ] ¿Todos los campos están en camelCase?
- [ ] ¿Los tipos de datos corresponden al lenguaje Python?
- [ ] ¿El ID es `int` (no string/UUID)?
- [ ] ¿La descripción es solo una frase funcional sin detalles técnicos?
- [ ] ¿Incluye campos de auditoría (usuarioCreacionId, fechaCreacion, etc.)?
- [ ] ¿Incluye campo estado si aplica?
- [ ] ¿Se evaluó si aplica entidadId?
- [ ] ¿Cada campo tiene: Nombre, Tipo, Longitud, Requerido, Consideración?
