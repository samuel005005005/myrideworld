---
description: Logging JSON estructurado, bitácora de negocio, PII
alwaysApply: false
---
# Logging Estructurado

## Propósito

Define las reglas de logging para que los logs sean útiles en depuración, monitoreo y auditoría, sin comprometer la seguridad ni el rendimiento.

---

## Niveles de Log

| Nivel | Cuándo usar | Ejemplo |
|-------|-------------|---------|
| **ERROR** | Algo falló y requiere atención inmediata. El sistema no pudo completar una operación. | Excepción no recuperable, timeout de BD, servicio externo caído |
| **WARN** | Algo inesperado ocurrió pero el sistema se recuperó. Podría volverse un error. | Retry exitoso, fallback activado, rate limit cercano |
| **INFO** | Eventos relevantes del flujo normal de negocio. Útil para saber "qué pasó". | Usuario creado, pedido procesado, pago completado |
| **DEBUG** | Detalle técnico para desarrollo. No debe estar activo en producción. | Valores de variables, queries ejecutadas, payloads recibidos |
| **TRACE** | Máximo detalle. Solo para troubleshooting temporal. | Flujo exacto de ejecución, cada paso del algoritmo |

### Reglas de Nivel

- **Producción**: solo ERROR + WARN + INFO activos.
- **Staging**: ERROR + WARN + INFO + DEBUG.
- **Desarrollo local**: todos los niveles.
- El nivel se controla por configuración (variable de entorno), no por código.

---

## Formato Estructurado

Preferir logs en formato JSON para facilitar búsqueda y análisis:

```json
{
  "timestamp": "2024-06-15T10:30:45.123Z",
  "level": "INFO",
  "message": "Usuario creado exitosamente",
  "context": {
    "userId": "uuid-123",
    "email": "j***@email.com",
    "action": "crear_usuario",
    "duration_ms": 45
  },
  "traceId": "abc-123-def"
}
```

### Campos Obligatorios

| Campo | Descripción |
|-------|-------------|
| `timestamp` | ISO 8601 con timezone |
| `level` | ERROR, WARN, INFO, DEBUG |
| `message` | Descripción legible del evento |
| `context` | Datos relevantes del evento (sin PII sin enmascarar) |
| `traceId` | Identificador para trazar una request completa |

---

## Qué Loguear

### SÍ loguear

- Inicio y fin de operaciones de negocio importantes (con duración).
- Errores con contexto: qué se intentó, con qué datos (enmascarados), qué falló.
- Llamadas a servicios externos (URL, método, status code, duración).
- Eventos de seguridad: login exitoso/fallido, cambio de password, escalación de privilegios.
- Métricas de negocio: pedido creado, pago procesado, usuario registrado.

### NO loguear

| Nunca loguear | Razón |
|---------------|-------|
| Passwords (ni hasheados) | Seguridad |
| Tokens completos (JWT, API keys) | Seguridad |
| Números de tarjeta, CVV | PCI compliance |
| Datos personales sin enmascarar (DNI, teléfono completo) | GDPR / privacidad |
| Request/response bodies completos en producción | Rendimiento + seguridad |
| Stack traces en respuestas al usuario | Seguridad (sí en logs internos) |

### Cómo Enmascarar

```
Email:    j***@email.com
Teléfono: ***-***-4567
Tarjeta:  ****-****-****-1234
Token:    eyJ....[REDACTED]
```

---

## Patrones por Capa

### Presentación (Controller)

```
INFO  → Request recibido: POST /api/usuarios
INFO  → Response enviado: 201 Created (45ms)
ERROR → Request fallido: POST /api/usuarios → 400 Bad Request
```

### Aplicación (Use Case)

```
INFO  → Iniciando caso de uso: CrearUsuario { email: j***@email.com }
INFO  → Caso de uso completado: CrearUsuario { userId: uuid-123, duration: 42ms }
WARN  → Email ya registrado, operación rechazada: j***@email.com
```

### Infraestructura (Repositorio / Cliente HTTP)

```
DEBUG → Query ejecutada: SELECT * FROM usuarios WHERE id = ? (3ms)
WARN  → Retry #2 a servicio de notificaciones (timeout previo: 5000ms)
ERROR → Servicio de email no disponible después de 3 reintentos
```

---

## Correlación (Trace ID)

- Toda request debe tener un `traceId` único que se propaga entre capas y servicios.
- Si llega en header (`X-Request-Id`, `X-Correlation-Id`), usarlo. Si no, generar uno.
- Incluir el traceId en TODOS los logs de esa request.
- En microservicios, propagar el traceId en llamadas entre servicios.

---

## Implementación por Lenguaje

| Lenguaje | Librería recomendada | Configuración |
|----------|---------------------|---------------|
| Java / Kotlin | SLF4J + Logback | `logback-spring.xml` |
| .NET | Serilog | `appsettings.json` → Serilog section |
| Python | `structlog` o `logging` con JSON formatter | `logging.config` |
| TypeScript | `pino` o `winston` | Config en bootstrap |
| Dart/Flutter | `logger` package | Provider en Riverpod |

---

## Anti-Patrones

| Anti-patrón | Problema | Solución |
|-------------|----------|----------|
| `catch (e) { print(e) }` | Se pierde contexto, no va a sistema de logs | Usar logger con nivel ERROR + contexto |
| Log sin contexto: "Error ocurrido" | Inútil para debuggear | Incluir qué, dónde, con qué datos |
| Loguear en loop interno | Mata rendimiento, llena disco | Loguear resumen al final o usar sampling |
| Log de todo el request body | Expone PII, infla volumen | Solo campos relevantes, enmascarados |
| `System.out.println` / `console.log` en producción | No estructurado, no tiene niveles | Usar framework de logging |
| Mismo mensaje para éxito y error | Difícil filtrar en monitoreo | Mensajes distintos y descriptivos |

---

## Bitácora de Auditoría (Patrón la empresa)

Además del logging técnico, la empresa mantiene una **bitácora de negocio** en tabla de BD (`fe.bitacora_evento`). Es auditoría para saber quién hizo qué operación sobre qué entidad.

### Diferencia entre Logging y Bitácora

| Aspecto | Logging (CloudWatch) | Bitácora (BD) |
|---------|---------------------|---------------|
| **Propósito** | Debugging, monitoreo técnico | Auditoría de negocio, trazabilidad |
| **Destino** | stdout → CloudWatch Logs | Tabla PostgreSQL `bitacora_evento` |
| **Retención** | Configurable (30 días típico) | Permanente (requisito legal/compliance) |
| **Quién lo consulta** | DevOps, desarrolladores | Negocio, auditoría, soporte |
| **Qué registra** | Errores técnicos, latencias, debug | Acciones de usuario sobre entidades |

### Modelo de Bitácora

```python
class BitacoraEvento:
    tipo_evento: int          # INFO=1, WARN=2, ERROR=3
    servicio_sistema: int     # ID del módulo (emisión=1, consulta=2, portal=3...)
    detalle: str              # Descripción legible del evento
    usuario: str              # Usuario que realizó la acción
    fecha: datetime           # Timestamp
    entidad_id: str | None    # ID del recurso afectado
    accion: str | None        # EMITIR, ANULAR, CREAR, ACTUALIZAR, etc.
```

### Tipos de Evento

| ID | Tipo | Cuándo |
|----|------|--------|
| 1 | INFO | Operación exitosa |
| 2 | WARN | Operación con advertencia (reintento, dato faltante) |
| 3 | ERROR | Operación fallida |

### Cuándo Registrar Bitácora

| Operación | Bitácora | Tipo |
|-----------|----------|------|
| Emitir factura | Sí | INFO |
| Anular documento | Sí | INFO |
| Cambio de estado | Sí | INFO |
| Login exitoso | Sí | INFO |
| Login fallido | Sí | WARN |
| Error de validación de negocio | Sí | WARN |
| Error de servicio externo (servicio externo, etc.) | Sí | ERROR |
| Consultas (GET) | No | — |
| Health checks | No | — |

### Patrón de Uso

```python
from shared.psycopg.common import insertar_bitacora_evento
from shared.constantes import BitacoraEvento, TipoEvento, ServicioSistema

# Después de operación exitosa
insertar_bitacora_evento(BitacoraEvento(
    tipo_evento=TipoEvento.INFO,
    servicio_sistema=ServicioSistema.EMISION,
    detalle=f"Factura {ncf} emitida exitosamente para RNC {rnc_receptor}",
    usuario=usuario_actual,
    entidad_id=str(factura_id),
    accion="EMITIR_FACTURA",
), connection)

# Después de error
insertar_bitacora_evento(BitacoraEvento(
    tipo_evento=TipoEvento.ERROR,
    servicio_sistema=ServicioSistema.EMISION,
    detalle=f"Error servicio externo al emitir {ncf}: {error_dgii}",
    usuario=usuario_actual,
    entidad_id=str(factura_id),
    accion="EMITIR_FACTURA",
), connection)
```

---

## Ejecución de Procesos (Tracking de Batch)

Para procesos batch/masivos, la empresa registra la ejecución en tabla `fe.ejecucion_proceso`:

```python
from shared.psycopg.common import insertar_ejecucion_proceso, actualizar_ejecucion_proceso
from shared.constantes import EstadoEjecucionProceso

# Inicio
ejecucion_id = insertar_ejecucion_proceso(
    proceso="REENVIO_FACTURA_servicio externo",
    estado=EstadoEjecucionProceso.EN_PROCESO,
    total_registros=len(pendientes),
    usuario="SISTEMA_SNS",
)

# ... procesamiento ...

# Fin
actualizar_ejecucion_proceso(
    ejecucion_id=ejecucion_id,
    estado=EstadoEjecucionProceso.COMPLETADO,
    registros_procesados=procesados,
    registros_error=errores,
)
```

---

## Alertas y Monitoreo

Los logs deben alimentar un sistema de observabilidad:

| Condición | Acción |
|-----------|--------|
| ERROR rate > 5% en 5 minutos | Alerta inmediata |
| WARN rate > 20% en 10 minutos | Alerta de precaución |
| Latencia P95 > 2 segundos | Alerta de rendimiento |
| Servicio externo con 3+ errores consecutivos | Circuit breaker + alerta |

---

## Reglas para el Agente

1. **Incluir logging** en todo código nuevo de casos de uso y llamadas externas.
2. **Nivel apropiado**. No todo es INFO. Errores son ERROR, cosas recuperables WARN.
3. **Contexto siempre**. Cada log debe responder: qué pasó, en qué operación, con qué datos relevantes.
4. **Enmascarar PII**. Si el log incluye email, teléfono o datos personales, enmascarar.
5. **No loguear secretos**. Passwords, tokens, API keys nunca aparecen en logs.
6. **Incluir duración** en operaciones de I/O (BD, HTTP, archivos).
7. **Usar el framework de logging del proyecto**, nunca `print`, `console.log` o `System.out.println`.
8. **No loguear dentro de loops** con muchas iteraciones. Loguear resumen al final.
9. **TraceId en toda request**. Si no hay correlación configurada, sugerirla.
10. **Errores con stack trace** en los logs internos, pero nunca en la respuesta al usuario.
11. **Bitácora en toda operación que modifica datos** — usar skill `bitacora-auditoria`.
12. **Procesos batch registran ejecución** — usar skill `proceso-ejecucion`.
13. **Logging técnico + Bitácora de negocio** son complementarios, no sustitutos.
