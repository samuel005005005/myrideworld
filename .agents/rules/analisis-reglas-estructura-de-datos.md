---
description: Reglas para estructuras de datos (modelo físico BD)
alwaysApply: false
---
# Reglas para Estructuras de Datos

Este steering define las reglas globales que aplican siempre que se trabaje con estructuras de datos en cualquier contexto (levantamiento, análisis, documentación).

---

## Principios Fundamentales de Modelado

### Regla de Oro de Arquitectura
> **Ningún campo debe existir en el modelo si no tiene un propósito funcional claramente identificado.**

### 1. Modelar el negocio antes que la base de datos
- Identificar entidades reales del negocio.
- Definir claramente qué representa cada entidad.
- No crear tablas basadas en pantallas o procesos temporales.
- Cada entidad debe tener una responsabilidad única.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `cliente` | `pantalla_consulta_cliente` |
| `contrato` | `proceso_carga_masiva` |
| `transaccion` | `vista_reporte_temporal` |

### 2. Toda tabla debe tener una clave primaria
- Cada registro debe poder identificarse de forma única.
- Utilizar claves sustitutas (`*_id bigint primary key`) cuando sea posible.
- Nunca depender de campos descriptivos como llave principal.

```sql
-- Correcto
cliente_id bigint primary key
-- Incorrecto: usar nombre o descripción como PK
```

### 3. Definir correctamente las relaciones
- Utilizar llaves foráneas para mantener integridad referencial.
- No almacenar información duplicada.
- Respetar cardinalidades:
  - **1:1** — relación uno a uno
  - **1:N** — relación uno a muchos
  - **N:M** — mediante tabla puente

### 4. Normalizar la información (mínimo 3FN)
- **Primera Forma Normal (1FN):** Sin listas dentro de una columna. Un valor por campo.
  - ❌ `telefonos = '8091111111,8092222222'`
  - ✅ Tabla separada `telefono_cliente`
- **Segunda Forma Normal (2FN):** Los atributos deben depender completamente de la clave primaria.
- **Tercera Forma Normal (3FN):** Eliminar dependencias transitivas. No guardar datos derivados que pueden obtenerse por otra relación.

### 5. No guardar datos calculables
- No almacenar valores que se pueden derivar.
```sql
-- ❌ Incorrecto
edad int
-- ✅ Correcto
fecha_nacimiento date
-- La edad se calcula: EXTRACT(YEAR FROM AGE(fecha_nacimiento))
```

### 6. Catálogos separados para valores parametrizables
- Evitar cadenas literales embebidas en columnas.
```sql
-- ❌ Incorrecto
tipo varchar(20) -- valores: 'COMPRA', 'VENTA', etc.
-- ✅ Correcto
tipo_operacion_id bigint references tipo_operacion(tipo_operacion_id)
```
- Relacionar mediante FK a una tabla catálogo.

### 7. Definir restricciones de negocio
Utilizar constraints según corresponda:
- **NOT NULL** — cuando el dato sea obligatorio.
- **UNIQUE** — cuando no pueda repetirse.
- **CHECK** — para catálogos cerrados o validaciones simples.
```sql
estado varchar(2) NOT NULL CHECK (estado IN ('AC','IN'))
```

### 8. Crear índices pensando en las consultas
Indexar:
- PK (automático)
- FK
- Campos de búsqueda frecuente
- Campos utilizados en filtros (`WHERE`, `ORDER BY`)

**No indexar todo indiscriminadamente.**

### 9. El modelo debe ser trazable al requerimiento
Para cada tabla y columna se debe poder responder:
- ¿Qué historia de usuario la requiere?
- ¿Qué proceso la utiliza?
- ¿Quién la mantiene?
- ¿Cuál es su definición de negocio?

**Si no puedes responder eso, probablemente no debería existir.**

---

## Clasificación Previa (OBLIGATORIO antes de proponer cualquier estructura)

### Paso A. Identificar el tipo de tabla
Antes de diseñar cualquier estructura, clasificar la tabla como:
- **Catálogo** — datos estáticos o semi-estáticos de referencia.
- **Transaccional** — registros de operaciones del negocio.
- **Configuración** — parámetros del sistema.
- **Histórico** — registro de cambios de estado o datos anteriores.
- **Integración** — datos de intercambio con sistemas externos.
- **Bitácora** — registro de eventos del sistema.
- **Proceso batch** — control de ejecución de procesos masivos.

### Paso B. Identificar características operativas
- Frecuencia de consulta.
- Volumen esperado.
- Crecimiento anual.
- Necesidad de auditoría.
- Necesidad de histórico.

### Paso C. Tipo de estructura de datos y motor de base de datos
Identificar el motor de BD del proyecto (PostgreSQL, Oracle, SQL Server, etc.) porque de aquí se deriva la nomenclatura de campos:
- PostgreSQL → snake_case
- Oracle → UPPER_CASE o snake_case según estándar del proyecto
- SQL Server → según estándar del proyecto

---

## Preguntas de Contexto (Guía de Levantamiento)

### Contexto general
- ¿Es proyecto nuevo?
- ¿Es catálogo o transacción?
- ¿Tiene workflow?
- ¿Tiene integración externa?

### Auditoría
- ¿Requiere trazabilidad?
- ¿Quién modifica los datos?

### Consulta
- ¿Cómo se consultará?
- ¿Por qué campos se filtrará?

### Volumen
- ¿Cuántos registros por día?
- ¿Cuántos usuarios concurrentes?

### Histórico
- ¿Debe conservar cambios?

### Seguridad
- ¿Aplica `entidad_id`?
- ¿Aplica usuario propietario?

---

## Reglas de Nomenclatura y Consistencia

### 10. Los nombres deben ser consistentes
Según el estándar interno:
- Utilizar nombres significativos.
- Las tablas deben ir en **singular**.
- No utilizar acentos.
- No utilizar caracteres especiales.
- Mantener consistencia de tipos y nombres entre tablas.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `cliente` | `clientes` |
| `usuario` | `tipos_de_activos` |
| `tipo_activo` | `Cliente#` |

### 10.1. Los campos iguales deben tener mismo nombre y tipo
Si un dato representa lo mismo en distintas tablas:
- ✅ Mismo nombre
- ✅ Mismo tipo
- ✅ Misma longitud

```sql
-- Este campo debe ser IDÉNTICO en todas las tablas donde aparezca:
usuario_creacion_id bigint
usuario_ultima_actualizacion_id bigint
```

### 10.2. Definir dominios y longitudes adecuadas
- No usar `varchar(500)` para todo.
- Las longitudes deben responder a una necesidad de negocio.
```sql
-- ✅ Correcto: longitudes con propósito
siglas varchar(10)
descripcion varchar(100)
estado varchar(2)
-- ❌ Incorrecto: longitud genérica sin justificación
campo_cualquiera varchar(500)
```

---

## Campos Obligatorios en documentación local (documento: Estructuras de Datos)

### Campos custom que SIEMPRE deben llenarse al crear/actualizar una Estructura de Datos:
- **Tipo de Estructura de Datos** (`Custom.TipodeEstructuradeDatos`): Indica el tipo de objeto. Valores del picklist: `Tabla Transaccional`, `Tabla Catálogo`, entre otros según la organización.
- **Motor de Base de Datos** (`Custom.MotordeBasedeDatos`): Indica el motor. Valores del picklist: `DYNAMODB`, `ORACLE`, `POSTGRE-SQL`, `SQL SERVER`.

### Campo Descripción en el body (cuerpo del documento Markdown)
El campo **Descripción** dentro del HTML del documento solo debe contener una frase corta que indique el propósito de la tabla. NO incluir detalles técnicos como el motor de BD, el tipo de nomenclatura, ni información que ya está en los campos custom.
- ✅ Correcto: "Tabla que almacena la información de usuarios del sistema."
- ❌ Incorrecto: "Tabla que almacena la información de usuarios del sistema (snake_case para BD PostgreSQL)."

Estos campos se derivan de la clasificación previa (Pasos A y C) y deben estar siempre presentes. Los valores deben coincidir exactamente con los del valores permitidos (case-sensitive).

---

## Reglas de Snake Case y Motor de BD

### 11. Snake case por defecto
Todos los nombres de campos deben estar en **snake_case** (ajustable según motor de BD identificado en el punto 3 de clasificación).
- PostgreSQL → snake_case
- Oracle → UPPER_CASE o snake_case según estándar del proyecto
- SQL Server → según estándar del proyecto

### 11.1 Nombres de tablas en singular
Los nombres de las estructuras de datos (tablas) siempre van en **singular** y en **snake_case**. Ejemplo: `usuario`, `bitacora_evento`, `ejecucion_proceso` (nunca `usuarios`, `bitacoras_eventos`).

---

## Campos de Auditoría

### 12. Auditoría obligatoria en tablas transaccionales
Por consistencia y trazabilidad, **toda tabla de negocio (transaccional)** debe incluir los siguientes campos de auditoría:
```sql
fecha_creacion            timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
usuario_creacion_id       bigint NOT NULL
fecha_ultima_actualizacion timestamp
usuario_ultima_actualizacion_id bigint
estado                    varchar(2) NOT NULL DEFAULT 'AC'
```

Para tablas catálogo o de configuración, solicitar confirmación al usuario si conviene incluirlos.

Cualquier otro campo de auditoría que amerite según el contexto también debe ser propuesto.

---

## Pertenencia a Entidad

### 13. Preguntar pertenencia
Preguntar si la información pertenece a una entidad específica. Si aplica:
- `entidad_id` (bigint, requerido)

---

## Tablas Catálogo

### 14. Verificar existencia previa
Antes de crear una nueva tabla catálogo, preguntar si existe un **catálogo corporativo equivalente**.

---

## Análisis de Estructura

### 15. Evaluar necesidades
Analizar si la estructura requiere:
- Unicidad
- Vigencia
- Control de fechas
- Estados
- Versionamiento
- Indicadores de proceso

---

## Tablas Complementarias

### 16. Proyecto nuevo
Si es proyecto nuevo, proponer la creación de las tablas `bitacora_evento` y `ejecucion_proceso`.

### 17. Tabla de histórico
Si la tabla tiene campo `estado` o involucra un proceso, preguntar si le aplica una **tabla de histórico**.

### 18. Campos adicionales por contexto
Sugerir campos adicionales de acuerdo al contexto del negocio (ej: si maneja procesos → `estado`, si maneja soft-delete → `estado` AC/IN, si maneja vigencias → `fecha_efectividad`, `fecha_expiracion`).
