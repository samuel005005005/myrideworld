---
description: Reglas para métodos de negocio y servicios REST
alwaysApply: false
---
# Reglas para Métodos y Servicios Web

Este steering define las reglas que aplican cuando se diseñan, documentan o revisan métodos de negocio y servicios web (REST APIs). Se divide en tres categorías: diseño de métodos, diseño de servicios REST, y documentación.

---

## Categoría 1: Diseño de Métodos

Reglas que aplican al diseñar la lógica interna de los métodos, independientemente de si son expuestos como servicio o no.

### 1.1 Responsabilidad única
Un método debe hacer **una sola cosa**. Si el nombre necesita "Y" o "And" para describir lo que hace, probablemente debe dividirse.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `calcularComision()` | `calcularComisionYEnviarCorreoYGenerarReporte()` |
| `enviarNotificacion()` | `procesarTodoElFlujo()` |
| `validarUsuario()` | `validarYCrearYNotificar()` |

### 1.2 Nombre descriptivo basado en verbos
El nombre debe indicar claramente la acción que realiza. Usar verbos en infinitivo que reflejen el propósito.

**Verbos estándar según operación:**

| Operación | Verbo preferido | Alternativas válidas |
|-----------|----------------|---------------------|
| Consulta singular | `obtener` | `consultar` |
| Consulta múltiple | `listar` | `buscar`, `consultar` |
| Creación | `registrar` | `crear` |
| Actualización | `actualizar` | `modificar` |
| Eliminación lógica | `inactivar` | `desactivar` |
| Eliminación física | `eliminar` | `remover` |
| Validación | `validar` | `verificar` |
| Cálculo | `calcular` | `computar` |
| Envío | `enviar` | `notificar`, `despachar` |
| Procesamiento | `procesar` | `ejecutar` (solo si es proceso batch) |

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `obtenerCliente` | `Procesar` |
| `registrarPortafolio` | `Ejecutar` |
| `procesarTransaccion` | `Metodo1` |
| `validarUsuario` | `datos` |

> **Nota:** Los métodos de creación se nombran con `registrar`, no `insertar`. Ej: `registrarBitacora`, no `insertarBitacora`.

### 1.3 Parámetros mínimos necesarios
No enviar parámetros que el método no utiliza. Cada parámetro debe tener un propósito claro.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `obtenerCliente(clienteId: int)` | `obtenerCliente(clienteId: int, nombre: str, correo: str)` |
| `listarTransacciones(fechaDesde: date, fechaHasta: date)` | `listarTransacciones(fechaDesde: date, fechaHasta: date, colorFondo: str)` |

**Criterios:**
- Si un parámetro no se usa en la lógica, no debe estar.
- Si un método necesita más de 5 parámetros, evaluar si conviene un objeto/DTO.
- Los parámetros opcionales deben diferenciarse claramente de los obligatorios.

### 1.4 Validar entradas (siempre)
Todo método debe validar sus entradas antes de ejecutar la lógica de negocio:

| Validación | Descripción | Ejemplo |
|-----------|-------------|---------|
| Obligatoriedad | Campos requeridos no nulos/vacíos | `clienteId` no puede ser None |
| Formato | Estructura correcta del dato | Email con formato válido |
| Longitud | Dentro del rango permitido | `nombre` máximo 100 caracteres |
| Rango | Valores dentro de límites lógicos | `monto > 0` |
| Nulos | Manejo explícito de valores nulos | `Optional` vs requerido |
| Existencia | El recurso referenciado existe | `clienteId` existe en BD |
| Estado | El recurso está en estado válido | Cliente en estado `AC` |

### 1.5 No contener lógica duplicada
Si una lógica aparece en más de un lugar, debe extraerse a un método reutilizable.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `validarVigencia(fechaEfectividad, fechaExpiracion)` reutilizado | Repetir la misma validación en 5 métodos distintos |
| `registrarBitacora(...)` centralizado | Copiar el bloque de bitácora en cada servicio |

### 1.6 Documentar todos los métodos públicos
Todo método público debe documentarse con:

```
Método: nombreMetodo

Descripción:
Qué hace el método (una oración clara).

Parámetros:
- parametro1 (tipo, obligatorio/opcional): descripción.
- parametro2 (tipo, obligatorio/opcional): descripción.

Retorna:
Qué devuelve y su tipo.

Excepciones:
- Condición → Motivo Estado / Mensaje de error.
```

---

## Categoría 2: Diseño de Servicios Web (REST APIs)

Reglas que aplican al diseñar la interfaz HTTP de los servicios expuestos.

### 2.1 Cada servicio representa una capacidad de negocio
No diseñar APIs pensando en la pantalla ni en los botones de la UI.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `POST /api/transacciones` | `POST /api/botonGuardarPantalla123` |
| `GET /api/clientes/{id}` | `GET /api/consultaPantallaCliente` |
| `PUT /api/portafolios/{id}` | `PUT /api/actualizarFormulario` |

### 2.2 Uso correcto de verbos HTTP

| Verbo | Uso | Idempotente | Body |
|-------|-----|-------------|------|
| `GET` | Consultar recurso(s) | Sí | No |
| `POST` | Crear recurso nuevo | No | Sí |
| `PUT` | Actualizar recurso completo | Sí | Sí |
| `PATCH` | Actualización parcial | No | Sí |
| `DELETE` | Eliminar recurso | Sí | No* |

*En soft-delete, se usa `PATCH` para cambiar estado a `IN`, no `DELETE`.

### 2.3 URLs orientadas a recursos (sustantivos, no verbos)

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `/api/clientes` | `/api/getClientes` |
| `/api/clientes/{id}` | `/api/updateCliente` |
| `/api/clientes/{id}/portafolios` | `/api/obtenerPortafoliosDelCliente` |
| `/api/transacciones?estado=PE` | `/api/filtrarTransaccionesPendientes` |

**Convenciones de URL:**
- Recursos en plural: `/clientes`, `/transacciones`, `/portafolios`.
- Relaciones anidadas: `/clientes/{clienteId}/cuentas`.
- Filtros como query params: `?estado=AC&fechaDesde=2026-01-01`.
- Path params para identificadores: `/{id}`.

### 2.4 Versionamiento de APIs

```
/api/v1/clientes
/api/v2/clientes
```

- Versionar **siempre** desde el inicio (`v1`).
- Incrementar versión cuando hay breaking changes.
- Mantener la versión anterior activa durante un período de transición.
- Nunca modificar el contrato de una versión publicada.

### 2.5 Códigos HTTP adecuados

| Código | Significado | Cuándo usar |
|--------|-------------|-------------|
| `200` | OK | Consulta o actualización exitosa |
| `201` | Creado | Recurso creado exitosamente (POST) |
| `204` | Sin contenido | Eliminación exitosa |
| `400` | Solicitud inválida | Datos de entrada incorrectos |
| `401` | No autenticado | Token ausente o expirado |
| `403` | No autorizado | Sin permisos suficientes |
| `404` | No encontrado | Recurso no existe |
| `409` | Conflicto | Violación de unicidad o estado inválido |
| `422` | Entidad no procesable | Regla de negocio incumplida |
| `500` | Error interno | Error no controlado del servidor |

### 2.6 Manejo estandarizado de errores
Toda respuesta de error debe seguir esta estructura:

```json
{
  "code": "CLI001",
  "message": "Cliente no encontrado",
  "type": "BusinessException"
}
```

**Tipos de excepción estándar:**
- `ValidationException` — datos de entrada inválidos (400)
- `BusinessException` — regla de negocio incumplida (422)
- `NotFoundException` — recurso no encontrado (404)
- `UnauthorizedException` — sin autenticación (401)
- `ForbiddenException` — sin permisos (403)
- `ConflictException` — conflicto de estado/unicidad (409)

### 2.7 Nunca exponer información sensible
No exponer en respuestas:
- Contraseñas ni hashes de contraseñas.
- Tokens internos ni API keys.
- Datos personales innecesarios (solo los que el consumidor necesita).
- Stack traces ni detalles internos de implementación.
- Queries SQL ni nombres de tablas.
- Rutas de archivos del servidor.

### 2.8 Implementar autenticación y autorización
Todo servicio debe definir explícitamente:

| Aspecto | Descripción |
|---------|-------------|
| Tipo de autenticación | OAuth2 Bearer Token, ApiKey, Basic Auth, etc. |
| Roles autorizados | Qué roles pueden invocar el servicio |
| Permisos específicos | Qué permisos granulares se requieren |
| Filtrado por entidad | Si aplica filtrado por entidad del usuario autenticado |

---

## Categoría 3: Documentación de Servicios Web

Reglas que aplican al documentar un servicio como archivo Markdown en `docs/analisis/metodos/`.

### REGLA FUNDAMENTAL: Seguir la plantilla de referencia

**Es OBLIGATORIO** seguir la estructura exacta definida en la plantilla de referencia:
`[`references/Metodo-Servicio.md`](../analisis-requirements-engineering/references/Metodo-Servicio.md)`

Todo método documentado debe replicar la estructura de dicha plantilla, incluyendo:
- Encabezado con **MÉTODO** + nombre del método
- Sección **DATOS GENERALES** (Controlador, URI, Modelo, Servicio, Descripción de la Lógica)
- Tabla de **ENTRADA (REQUEST)** con columnas: Parámetro, Tipo de Dato, Longitud, Requerido, Consideraciones
- Tabla de **SALIDA EXITOSA (RESPONSE)** con columnas: Parámetro, Tipo de Dato, Requerido, Longitud, Contenido
- Tabla de **SALIDA DE ERROR** con columnas: Código (HTTP Status), Excepción, Motivo ID, Consideraciones

No se permiten variaciones en la estructura ni en el orden de las secciones.

### 3.1 Estructura obligatoria del documento

Todo servicio documentado debe contener estas secciones en orden:

#### A. Datos Generales

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| Nombre | Nombre funcional del método | `obtenerCliente` |
| Descripción | Qué hace (1-2 oraciones) | "Obtiene la información de un cliente por su identificador." |
| Sistema consumidor | Quién lo utiliza | Portal Web, App Móvil |
| Sistema proveedor | Quién expone el servicio | API Core Clientes |
| Versión | Versión del servicio | v1 |

#### B. Endpoint

```
VERBO /api/v{version}/recurso/{pathParam}?queryParam1={valor}&queryParam2={valor}
```

La URI debe incluir **todos** los parámetros: path params y query params.

#### C. Autenticación

```
Bearer Token (OAuth2)
```

#### D. Headers

| Header | Requerido | Valor |
|--------|-----------|-------|
| Authorization | Sí | Bearer {token} |
| Content-Type | Sí | application/json |
| Accept | Sí | application/json |

#### E. Parámetros de Entrada

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| clienteId | int | Sí | Identificador del cliente |

#### F. Request Ejemplo (cuando aplique body)

```json
{
  "clienteId": 10001
}
```

#### G. Descripción de la Lógica (pasos numerados)
Lista numerada con la lógica del método, incluyendo:
- Validaciones realizadas.
- Consultas o procesamientos.
- Transformaciones de datos.
- Invocación a otros servicios.
- **Último paso siempre:** registro de bitácora.

#### H. Respuesta Exitosa

| Campo | Tipo | Descripción |
|-------|------|-------------|
| clienteId | int | Identificador del cliente |
| nombre | str | Nombre del cliente |

```json
{
  "clienteId": 10001,
  "nombre": "Juan Pérez"
}
```

#### I. Salidas de Error

| HTTP Status | Motivo Estado | Descripción |
|-------------|---------------|-------------|
| 400 | VAL001 | El campo clienteId es obligatorio. |
| 404 | CLI001 | Cliente no encontrado. |
| 422 | CLI002 | Cliente en estado inactivo. |

### 3.2 Nombres de parámetros en camelCase (siempre)
Todos los nombres de parámetros de entrada y salida se escriben en **camelCase**.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `usuarioId` | `usuario_id` |
| `entidadId` | `entidad_id` |
| `fechaCreacion` | `fecha_creacion` |
| `criteriosConsulta` | `criterios_consulta` |

### 3.3 Bitácora como último paso de la lógica (siempre)
El último ítem de la Descripción de la Lógica **siempre** debe ser el guardado de bitácora:

```
N. El sistema guarda un registro de Bitácora de Eventos, conteniendo:
   a. ID de Bitácora de Eventos: Código autogenerado.
   b. ID de Servicio: [ID] - [NOMBRE DEL SERVICIO].
   c. Descripción: "Proceso de [acción del método]".
   d. Fecha: Fecha con hora, minutos, segundos.
   e. Criterios de Consulta: Todos los parámetros de entrada en formato JSON.
   f. Tipo Evento: 1=Exitoso, 2=Advertencia (regla de negocio), 3=Fallido.
```

### 3.4 Métodos genéricos no referencian invocadores
Los métodos de uso general (como `registrarBitacora`) se documentan de forma genérica, sin mencionar qué métodos específicos los invocan.

### 3.5 Métodos de validación interna no se documentan aparte
Su lógica se menciona dentro de la Descripción de la Lógica del método principal que los invoca.

---

## Regla de Oro para Analistas

Cuando documentes un método o servicio, debes poder responder estas **7 preguntas**. Si alguna no está documentada, la especificación está **incompleta**:

| # | Pregunta | Sección que la responde |
|---|----------|------------------------|
| 1 | ¿Qué hace? | Descripción |
| 2 | ¿Quién lo consume? | Sistema consumidor |
| 3 | ¿Qué recibe? | Parámetros de Entrada |
| 4 | ¿Qué devuelve? | Respuesta Exitosa |
| 5 | ¿Qué valida? | Descripción de la Lógica |
| 6 | ¿Qué errores puede generar? | Salidas de Error |
| 7 | ¿Qué reglas de negocio ejecuta? | Descripción de la Lógica |

---

## Checklist de calidad para Métodos/Servicios

- [ ] ¿El nombre sigue la convención verbo + sustantivo en camelCase?
- [ ] ¿Tiene responsabilidad única?
- [ ] ¿Los parámetros son los mínimos necesarios?
- [ ] ¿Valida todas las entradas?
- [ ] ¿Usa el verbo HTTP correcto?
- [ ] ¿La URL está orientada a recursos (sin verbos)?
- [ ] ¿Está versionada la API?
- [ ] ¿Los códigos HTTP son los adecuados?
- [ ] ¿Los errores siguen la estructura estándar?
- [ ] ¿No expone información sensible?
- [ ] ¿Define autenticación y autorización?
- [ ] ¿La documentación responde las 7 preguntas?
- [ ] ¿Incluye bitácora como último paso?
- [ ] ¿Los parámetros están en camelCase?
