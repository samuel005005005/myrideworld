# Plantilla: Método / Servicio

> Sustituye los valores entre corchetes `[...]` por los datos reales del método.

---

**MÉTODO** [nombreMetodo]

**DATOS GENERALES**

**Controlador:** [NombreController]

**URI:** [VERBO] /api/v1/[recurso]/{pathParam}?queryParam={valor}

**Modelo:** [NombreModelo]

**Servicio:** [ID] - [NOMBRE DEL SERVICIO]

**Descripción de la Lógica:** [Descripción general del propósito del método en 1-2 oraciones]

1. [Validación de autenticación]
2. [Validación de rol/permiso]
3. [Validación de estado del rol/permiso AC]
4. [Validación de vigencia del rol/permiso]:
   a. La fecha de efectividad debe ser menor o igual a la fecha actual.
   b. La fecha de expiración debe ser mayor o igual a la fecha actual.
5. [Si no cumple seguridad → motivo estado: 1018 - Acceso Restringido]
6. [Validaciones de entrada: obligatoriedad, formato, longitud]
7. [Lógica de negocio específica]
8. [Consulta/procesamiento principal]
9. El sistema guarda un registro de Bitácora de Eventos, conteniendo:
   a. **ID de Bitácora de Eventos:** Código autogenerado.
   b. **ID de Servicio:** [ID] - [Nombre del Servicio].
   c. **Descripción:** "Proceso de [acción del método]".
   d. **Fecha:** Fecha con hora, minutos, segundos.
   e. **Criterios de Consulta:** Todos los parámetros de entrada en formato JSON.
   f. **Tipo Evento:** 1=Exitoso, 2=Advertencia, 3=Fallido.

---

**ENTRADA (REQUEST)**

| Parámetro | Tipo de Dato | Longitud | Requerido | Consideraciones |
|-----------|-------------|----------|-----------|-----------------|
| entidadId | int | 5 | Sí | Viaja a través de pathParameter. |
| estado | str | 2 | No | Viaja a través de queryParameter. Valores: 'AC', 'IN'. |
| descripcion | str | 50 | No | Viaja a través de queryParameter. |
| limite | int | 2 | No | Valor por defecto = 20. |
| numeroPagina | int | N/A | No | Valor por defecto = 1. |

---

**SALIDA EXITOSA (RESPONSE)**

| Parámetro | Tipo de Dato | Requerido | Longitud | Contenido |
|-----------|-------------|-----------|----------|-----------|
| **STATUS [código]** | Código | Sí | N/A | N/A |
| data | list | Sí | N/A | list<[Modelo]> |

---

**SALIDA DE ERROR**

| Código | Excepción | Motivo ID | Consideraciones |
|--------|-----------|-----------|-----------------|
| **STATUS 500** | Error interno o Error Inesperado | | |
| **STATUS 400** | Error en la petición del servicio | | Cuando existan valores no permitidos por las restricciones. |
| **STATUS 401** | Usuario no autenticado | | Token ausente o expirado. |
| **STATUS 403** | Acceso Restringido | 1018 | El usuario no tiene rol/permiso válido o vigente. |
| **STATUS 404** | Registro no encontrado | | |
| **STATUS 409** | Registro duplicado | [ID] | [Descripción del conflicto]. |
