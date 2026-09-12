---
name: dev-bitacora-auditoria
description: Patrón de bitácora/auditoría de negocio en BD (request/response/criterio_consulta). Use when registering audit events, mutating endpoints, or mentioning bitácora/auditoría.
---

# Bitácora y Auditoría - la empresa

## Purpose

Conocimiento sobre el patrón de bitácora/auditoría de la empresa. Define qué eventos se registran, con qué estructura, y en qué momentos del flujo de negocio.

## Use this skill when

- El usuario necesita registrar un evento de auditoría.
- Se crea un endpoint que modifica datos (crear, actualizar, eliminar, cambiar estado).
- Se necesita tracking de quién hizo qué y cuándo.
- Se menciona "bitácora", "auditoría", "registro de evento", "log de operación".

## Instructions

### 1. Concepto de Bitácora en la empresa

La bitácora es un registro de **auditoría de negocio** (no debug técnico). Cada operación relevante deja un rastro con quién la hizo, qué hizo, sobre qué entidad, y si fue exitosa o no.

Se almacena en tabla de base de datos (ej: `esquema.bitacora_evento`) para consulta posterior por parte de usuarios internos, auditoría y trazabilidad.

### 2. Estructura de un Evento de Bitácora

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `tipo_evento` | Severidad del evento | INFO, WARN, ERROR |
| `servicio_sistema` | Módulo/servicio que genera el evento | EMISION, RECEPCION, AUTENTICACION, PORTAL |
| `detalle` | Descripción legible del evento | "Factura NCF A01001... emitida exitosamente" |
| `criterio_consulta` | Parámetros usados antes de consultar BD o servicio externo | JSON con los filtros/params enviados |
| `request` | Payload enviado al servicio externo (si aplica) | JSON del body/params enviados |
| `response` | Respuesta recibida del servicio externo (si aplica) | JSON del response (resumido si es grande) |
| `usuario` | Quién realizó la acción | "jperez@empresa.com" o "SISTEMA_SNS" |
| `fecha` | Timestamp del evento | ISO 8601 |
| `ip` | IP del cliente (opcional) | "192.168.1.100" |
| `entidad_id` | ID del recurso afectado | "factura-uuid-123" |
| `accion` | Verbo de la operación | EMITIR, ANULAR, APROBAR, CREAR, ACTUALIZAR |
| `duracion_ms` | Tiempo de ejecución de la operación | 245 |

### 2.1 Qué guardar en criterio_consulta / request / response

**Al consultar BD:**
```
criterio_consulta: { "rnc": "123456789", "fecha_desde": "2026-01-01", "estado": "PENDIENTE" }
response: { "total_registros": 15 }  // no el dataset completo
```

**Al llamar servicio externo:**
```
request: { "url": "https://dgii.gov.do/ws/facturas", "method": "POST", "body": { "ncf": "..." } }
response: { "status": 200, "body": { "trackId": "abc-123", "estado": "ACEPTADO" } }
```

**Regla:** Guardar al menos 1 bitácora por servicio/endpoint con: lo que se mandó (criterio o request) y lo que se recibió (resultado o response). Esto permite reconstruir el flujo sin revisar logs.

### 3. Tipos de Evento

| Tipo | Cuándo usar |
|------|-------------|
| **INFO** | Operación exitosa (factura emitida, usuario creado, aprobación completada) |
| **WARN** | Operación con advertencia (reintento exitoso, dato faltante no crítico, validación parcial) |
| **ERROR** | Operación fallida (error de BD, servicio externo caído, validación de negocio rechazada) |

### 4. Cuándo Registrar

| Operación | Registrar | Tipo |
|-----------|-----------|------|
| Crear recurso | Sí | INFO |
| Actualizar recurso | Sí | INFO |
| Eliminar / Anular recurso | Sí | INFO |
| Cambio de estado | Sí | INFO |
| Login exitoso | Sí | INFO |
| Login fallido | Sí | WARN |
| Error de validación de negocio | Sí | WARN |
| Error de servicio externo | Sí | ERROR |
| Error interno no recuperable | Sí | ERROR |
| Consultas (GET sin modificación) | No | — |
| Health checks | No | — |

### 5. Cuándo NO Registrar

- Consultas de solo lectura (listados, búsquedas, detalles)
- Health checks y endpoints de monitoreo
- Operaciones internas sin impacto de negocio (cache refresh, etc.)

### 6. Reglas de Contenido del Detalle

- **Descriptivo**: no "Error ocurrido" sino "Error al emitir documento NCF A01001: timeout servicio externo (5000ms)"
- **Con ID de entidad**: incluir el identificador del recurso afectado
- **PII enmascarada**: emails parciales (`j***@email.com`), no passwords ni tokens
- **Sin stack traces**: esos van al log técnico, no a la bitácora de negocio
- **Idioma**: español, consistente con el dominio de negocio

### 7. Diferencia entre Bitácora y Logging

| Aspecto | Bitácora (este skill) | Logging (steering 08) |
|---------|----------------------|----------------------|
| Propósito | Auditoría de negocio | Debug técnico |
| Audiencia | Usuarios internos, auditoría, compliance | Desarrolladores, DevOps |
| Almacenamiento | Base de datos (tabla) | CloudWatch, archivos, ELK |
| Contenido | Eventos de negocio | Detalle técnico (queries, payloads, stack traces) |
| Retención | Largo plazo (legal) | Corto/medio plazo |
| Consulta | Desde la app (portal interno) | Desde herramientas de monitoreo |

### 8. Patrón de Implementación (agnóstico de lenguaje)

```
Flujo:
1. Ejecutar la operación de negocio
2. Si exitosa → registrar bitácora INFO con resultado
3. Si falla → registrar bitácora ERROR con detalle del error
4. La bitácora se inserta en la misma transacción (o inmediatamente después)
```

En el caso de errores, registrar SIEMPRE antes de propagar la excepción.

### 9. Servicios del Sistema (catálogo)

Cada módulo/proyecto tiene un identificador único:

| ID | Servicio | Descripción |
|----|----------|-------------|
| Definir por proyecto | EMISION | Emisión de documentos fiscales |
| Definir por proyecto | RECEPCION | Recepción de documentos |
| Definir por proyecto | AUTENTICACION | Login, logout, cambio password |
| Definir por proyecto | PORTAL | Operaciones del portal interno |
| Definir por proyecto | PROCESO_BATCH | Procesos masivos/background |
| Definir por proyecto | INTEGRACION | Llamadas a sistemas externos |

## Output

Al aplicar este skill, el agente genera:
1. Registro de bitácora en cada operación de modificación
2. Try/catch que registra tanto éxito como error
3. Constantes del servicio/acción si no existen en el catálogo del proyecto
4. El detalle descriptivo con el ID de entidad incluido
