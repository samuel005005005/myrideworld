---
name: dev-proceso-ejecucion
description: Patrón de procesos batch/background con tablas PE→EP→OK/ER, contadores y endpoint oculto SNS. Use when creating batch jobs, reenvío masivo, or proceso de ejecución.
---

# Proceso de Ejecución - la empresa

## Purpose

Conocimiento sobre el patrón de procesos batch/background de la empresa. Define cómo se registran, ejecutan y rastrean procesos masivos con control de estado, contadores y manejo de errores individuales.

## Use this skill when

- El usuario necesita crear un proceso batch o masivo.
- Se necesita reprocesar/reenviar documentos en lote.
- Se menciona "proceso", "ejecución", "batch", "reenvío masivo", "reprocesar".
- Se necesita un endpoint que procese N registros en background.
- Se necesita crear las tablas de ejecución de proceso en un proyecto nuevo.

## Preguntas que el agente debe hacer antes de implementar

Si el usuario pide crear un proceso batch y no proporciona esta información, **preguntar antes de generar**:

| # | Pregunta | Por qué |
|---|----------|---------|
| 1 | ¿Qué entidad procesa? (facturas, aprobaciones, documentos, etc.) | Define las FK del detalle |
| 2 | ¿Qué operación hace por cada item? (enviar a servicio externo, transformar, migrar) | Define qué va en json_generado/json_respuesta |
| 3 | ¿Cuál es el valor_clave para identificar cada item? (NCF, RNC, ID contrato) | Para búsqueda humana en portal |
| 4 | ¿Cómo se dispara? (SNS, manual desde portal, EventBridge schedule) | Define el tipo de endpoint |
| 5 | ¿El servicio externo devuelve un track_id? | Para saber si guardarlo |
| 6 | ¿Ya existen las tablas de ejecución en este proyecto? | Para saber si generar DDL |
| 7 | ¿En qué esquema de BD van? | Para el naming del DDL |

## Instructions

### 1. Concepto de Ejecución de Proceso

Un proceso de ejecución es una operación que procesa **múltiples registros** de forma controlada, rastreando:
- Cuántos registros hay que procesar
- Cuántos se procesaron exitosamente
- Cuántos fallaron
- El estado general del proceso (en curso, completado, con errores)
- Quién lo disparó y cuándo empezó/terminó

Se almacena en tabla de base de datos (ej: `esquema.ejecucion_proceso`) para consulta y monitoreo.

### 2. Modelo de Ejecución

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `id` | Identificador único de la ejecución | UUID o autoincremental |
| `proceso` | Nombre/código del proceso | "REENVIO_FACTURA_servicio externo" |
| `estado` | Estado actual de la ejecución | PE, EP, OK, RE, ER, OK_ER |
| `fecha_inicio` | Cuándo se inició | Timestamp |
| `fecha_fin` | Cuándo terminó (null si en proceso) | Timestamp |
| `total_registros` | Cantidad total a procesar | 150 |
| `registros_procesados` | Cantidad procesados exitosamente | 148 |
| `registros_error` | Cantidad con error | 2 |
| `detalle` | Resultado o descripción del error | "Procesados: 148, Errores: 2" |
| `usuario` | Quién disparó el proceso | "SISTEMA_SNS" o "jperez" |

### 3. Modelo de Detalle de Ejecución (por cada item del batch)

La tabla `detalle_ejecucion_proceso` guarda **un registro por cada item procesado** dentro del batch. Permite rastrear qué pasó con cada factura, aprobación o documento individual.

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `id` | Identificador del detalle | Autoincremental |
| `ejecucion_proceso_id` | FK al proceso padre | 42 |
| `factura_electronica_id` | ID de la factura procesada (si aplica) | 1234 |
| `aprobacion_comercial_id` | ID de la aprobación (si aplica) | null |
| `estado` | Estado de este item específico | PE, EP, OK, RE, ER |
| `motivo_estado_id` | Código del motivo (éxito o error) | 100 (éxito), 400 (error validación) |
| `fecha_registro` | Cuándo se procesó este item | Timestamp |
| `json_generado` | Request/payload enviado (lo que se mandó) | JSON del body al servicio externo |
| `json_respuesta` | Response recibido (lo que devolvió) | JSON de la respuesta |
| `traceback` | Stack trace si hubo error | String con el error completo |
| `valor_clave` | Identificador legible del item (NCF, RNC, etc.) | "A010010011500000001" |
| `track_id` | ID de tracking del servicio externo (servicio externo, etc.) | "abc-123-def" |

### 4. Estados de Ejecución

| Código | Nombre | Significado |
|--------|--------|-------------|
| **PE** | Pendiente | Registrado, esperando ser procesado |
| **EP** | En Proceso | Procesándose actualmente |
| **OK** | Exitoso | Procesado correctamente |
| **RE** | Rechazado | Rechazado por el servicio externo (respuesta negativa) |
| **ER** | Error | Error técnico (timeout, excepción, etc.) |
| **OK_ER** | Parcial | Proceso padre terminó con algunos items OK y otros ER |

### 5. Flujo Completo (Proceso + Detalle)

```
1. CREAR ejecucion_proceso (estado: EP, total_registros: N)

2. Para cada item del batch:
   a. INSERTAR detalle_ejecucion_proceso (estado: PE, json_generado: request)
   b. ACTUALIZAR detalle a estado: EP (en proceso)
   c. Ejecutar operación (enviar a servicio externo, procesar, etc.)
   d. Si éxito:
      - ACTUALIZAR detalle (estado: OK, json_respuesta: response, track_id: id_externo)
   e. Si error:
      - ACTUALIZAR detalle (estado: RE o ER, json_respuesta: error, traceback: stack)

3. ACTUALIZAR ejecucion_proceso:
   - Si todos OK → estado: OK
   - Si algunos fallaron → estado: OK_ER
   - Si error general → estado: ER
   - Actualizar contadores (registros_procesados, registros_error)
```

### 6. Qué guardar en json_generado y json_respuesta

**json_generado** (lo que se envió):
- Al llamar servicio externo: el payload/body completo
- Al consultar BD: los parámetros de la consulta
- Al invocar Lambda: el input

**json_respuesta** (lo que se recibió):
- Respuesta exitosa del servicio (status, body)
- Respuesta de error (código, mensaje)
- Si es BD: el resultado relevante (no dumps masivos)

**traceback** (solo cuando hay error):
- El stack trace completo de la excepción
- Permite debugging sin revisar CloudWatch

**valor_clave**:
- Un identificador humano del item (NCF, RNC, número de contrato)
- Para que en el portal se pueda buscar rápido "qué pasó con esta factura"

**track_id**:
- ID que devuelve el servicio externo (servicio externo trackId, transaction ID, etc.)
- Permite correlacionar con el sistema externo

### 5. Mecanismo de Disparo

En la empresa los procesos batch **no usan cron ni schedulers internos**. Se disparan mediante:

| Mecanismo | Cómo funciona |
|-----------|---------------|
| **SNS Topic** | Un tópico SNS envía un HTTP POST a un endpoint oculto del API |
| **Manual** | Un usuario del portal dispara el proceso desde la UI |
| **EventBridge** | Regla programada que publica en el tópico SNS |

El endpoint que recibe el disparo:
- No aparece en la documentación pública (Swagger)
- Valida que el mensaje viene de SNS (header `x-amz-sns-message-type`)
- Confirma suscripción si es la primera vez
- Ejecuta el proceso si es una notificación real

### 7. Reglas

1. **Todo proceso batch tiene ejecución padre + detalle por item**. Dos niveles siempre.
2. **Error en un registro NO detiene el batch** — se marca como RE/ER y continúa.
3. **json_generado y json_respuesta obligatorios** en cada detalle — permite reconstruir lo que pasó.
4. **traceback solo cuando hay excepción** — para debugging posterior.
5. **valor_clave obligatorio** — identificador humano del item para buscar en portal.
6. **Estados granulares**: PE → EP → OK/RE/ER. No saltarse EP.
7. **Al final, actualizar el padre** con contadores y estado global (OK, OK_ER, ER).
8. **Endpoints de proceso son ocultos** — `include_in_schema=False` (no aparecen en Swagger).
9. **Se disparan via SNS o EventBridge**, no via cron directo en la app.
10. **Idempotentes** — si el proceso se re-ejecuta, no debe duplicar items ya procesados exitosamente.
11. **Consultable desde portal** — el usuario puede ver el estado de cada item del proceso.

### 7. Ejemplos de Procesos Típicos

| Proceso | Trigger | Qué hace |
|---------|---------|----------|
| Reenvío factura servicio externo | SNS (schedule cada 30 min) | Busca facturas con estado "pendiente envío" y las envía a servicio externo |
| Reenvío a receptor | SNS | Busca facturas enviadas a servicio externo pero no entregadas al receptor |
| Reenvío aprobaciones | SNS | Reintenta aprobaciones comerciales fallidas |
| Sincronización catálogos | Manual/EventBridge | Actualiza catálogos desde sistema externo |

### 8. Relación con Bitácora

El proceso de ejecución y la bitácora son complementarios:

- **Ejecución de proceso** → visión macro (cuántos procesé, cuántos fallaron)
- **Bitácora** → visión micro (qué pasó con cada registro individual)

Para cada registro que falla dentro de un batch, se registra una bitácora tipo ERROR con el detalle específico.

## Output

Al aplicar este skill, el agente genera:
1. **DDL de tablas** (si no existen): `ejecucion_proceso` + `detalle_ejecucion_proceso`
2. **Funciones de acceso a BD**: insertar/actualizar ejecución y detalle
3. **Constantes**: estados (PE, EP, OK, RE, ER, OK_ER) y nombre del proceso
4. **Endpoint oculto** que recibe el disparo (SNS, manual, o EventBridge)
5. **Lógica del proceso**: flujo PE → EP → OK/RE/ER por cada item
6. **Actualización del padre** al final con contadores y estado global
7. **Integración con bitácora** para errores críticos

---

## DDL - Creación de Tablas

Si el proyecto no tiene las tablas, generarlas con esta estructura base (adaptar esquema y FK según el proyecto):

### Tabla: ejecucion_proceso

```sql
CREATE TABLE {esquema}.ejecucion_proceso (
    id                    SERIAL PRIMARY KEY,
    proceso               VARCHAR(100) NOT NULL,
    estado                VARCHAR(5) NOT NULL DEFAULT 'PE',
    fecha_inicio          TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_fin             TIMESTAMP,
    total_registros       INTEGER NOT NULL DEFAULT 0,
    registros_procesados  INTEGER NOT NULL DEFAULT 0,
    registros_error       INTEGER NOT NULL DEFAULT 0,
    detalle               TEXT,
    usuario               VARCHAR(100) NOT NULL,
    fecha_creacion        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ejecucion_proceso_estado ON {esquema}.ejecucion_proceso(estado);
CREATE INDEX idx_ejecucion_proceso_proceso ON {esquema}.ejecucion_proceso(proceso);
```

### Tabla: detalle_ejecucion_proceso

```sql
CREATE TABLE {esquema}.detalle_ejecucion_proceso (
    id                      SERIAL PRIMARY KEY,
    ejecucion_proceso_id    INTEGER NOT NULL REFERENCES {esquema}.ejecucion_proceso(id),
    -- FK a la entidad procesada (adaptar según proyecto):
    -- factura_electronica_id  INTEGER,
    -- aprobacion_comercial_id INTEGER,
    -- documento_id            INTEGER,
    entidad_id              INTEGER,
    estado                  VARCHAR(5) NOT NULL DEFAULT 'PE',
    motivo_estado_id        INTEGER,
    fecha_registro          TIMESTAMP NOT NULL DEFAULT NOW(),
    json_generado           JSONB,
    json_respuesta          JSONB,
    traceback               TEXT,
    valor_clave             VARCHAR(200),
    track_id                VARCHAR(200)
);

CREATE INDEX idx_detalle_ejecucion_proceso_padre ON {esquema}.detalle_ejecucion_proceso(ejecucion_proceso_id);
CREATE INDEX idx_detalle_ejecucion_proceso_estado ON {esquema}.detalle_ejecucion_proceso(estado);
CREATE INDEX idx_detalle_ejecucion_proceso_valor_clave ON {esquema}.detalle_ejecucion_proceso(valor_clave);
```

### Notas sobre el DDL

- `{esquema}` se reemplaza por el esquema del proyecto (ej: `fe`, `sd`, `public`)
- La FK genérica `entidad_id` se puede reemplazar por FKs específicas según la entidad que procesa (factura, aprobación, documento, etc.)
- `JSONB` para json_generado/json_respuesta permite queries sobre el contenido
- Índices en estado y valor_clave para consultas desde portal
- Si se usa otro motor (MySQL, SQL Server), adaptar tipos (JSONB → JSON, SERIAL → AUTO_INCREMENT/IDENTITY)
