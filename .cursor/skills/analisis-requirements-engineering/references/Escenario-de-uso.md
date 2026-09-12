# Plantilla: Escenario de Uso

> Sustituye los valores entre corchetes `[...]` por los datos reales del escenario.

---

**Nombre del escenario:** `<Verbo en infinitivo> <Objeto/Entidad>`

---

### Objetivo:

Permite a un usuario autorizado [acción en infinitivo] [objeto/entidad] de la entidad asociada al usuario que realiza la [acción].

---

### Criterios de Aceptación:

1. Debe existir una interfaz que permita a un usuario autenticado de manera satisfactoria el [acción] una o varias [entidades] que se encuentren en la entidad para la cual realiza la consulta.
2. Validaciones de seguridad:
   a. El sistema valida que el usuario autenticado tenga asignado Rol (**GESTIONAR_[ENTIDAD]**) o los Permisos (**[PERMISO_ESPECIFICO]**), según establece la Especificación Suplementaria de Datos Descripción de Roles y Permisos.
   b. El sistema valida que los Permisos y el Rol se encuentren en estado AC (Activo).
   c. El sistema valida que la fecha de efectividad del permiso sea menor o igual a la fecha actual.
   d. El sistema valida que la fecha de expiración del permiso sea mayor o igual a la fecha actual.
   e. El sistema valida que la fecha de efectividad sea menor o igual a la fecha de expiración.
   f. Si el usuario autenticado no tiene asignado los permisos y roles para realizar dicha acción, el sistema retornará el motivo estado: [ID] - [Descripción].
3. Validaciones generales por funcionalidad:
   a. [Validaciones específicas del caso: fechas, existencia, estados, dependencias, paginación, etc.]
4. Reglas de integridad:
   a. Que todos los datos proporcionados cumplan con las Reglas de Integridad (ver Especificación Suplementaria: Reglas de Integridad).
5. Consulta/acción principal:
   a. El sistema consume el método [nombreMetodo] y muestra un resumen con los campos de consulta general (ver Especificación Suplementaria: Campos de Consulta General).
6. El sistema permitirá filtrar en base a los criterios especificados en el apartado de filtros según campos de consulta general.
7. Mensajería:
   a. El sistema muestra al usuario los mensajes de las incidencias ocurridas durante el proceso (ver Especificación Suplementaria: Mensajes de Incidencias).
   b. Cuando no existan [entidades] que cumplan con los criterios de búsqueda, el sistema debe indicar el motivo estado [ID] - [Mensaje].
8. Bitácora:
   a. El sistema registra una bitácora para la [acción] realizada, según lo especificado en Bitácora de Eventos.

---

### Detalle de Flujo:

1. El usuario accede a la interfaz de [acción] [entidad].
2. El sistema valida que el usuario esté autenticado de manera satisfactoria.
3. El sistema valida que el usuario tenga asignado el Rol o Permisos requeridos en estado AC (Activo) y con vigencias válidas.
4. [Si no cumple validación de seguridad] El sistema retorna motivo estado: [ID] - [Descripción].
5. El sistema presenta [la interfaz / los criterios de búsqueda / el formulario] al usuario.
6. El usuario [ingresa los criterios / completa los datos / selecciona las opciones].
7. El sistema valida que los datos proporcionados cumplan con las Reglas de Integridad.
8. [Si los datos no cumplen] El sistema retorna motivo estado: [ID] - [Descripción].
9. El sistema consume el método [nombreMetodo].
10. El sistema presenta los resultados según los campos de consulta general.
11. [Flujo alterno: sin resultados] Cuando no existan registros que cumplan con los criterios, el sistema indica el motivo estado: [ID] - [Mensaje].
12. El sistema registra una bitácora para [acción] según Bitácora de Eventos.

---

### Métodos Asociados:

1. [nombreMetodo] (**Servicio Sistema**: [ID] - [DESCRIPCIÓN])

---

### Consideraciones / Requerimientos No Funcionales (opcional):

- [Solo si aplica: rendimiento, auditoría avanzada, seguridad adicional, límites, paginación, etc.]

---

## Notas de uso

- **Nombre del escenario (Title):** Siempre en formato `<Verbo en infinitivo> <Objeto/Entidad>`. Ejemplos: "Consultar Jornadas Laborales", "Actualizar Dimensión de Línea", "Gestionar Catálogos del Sistema".
- **Motivos Estado:** Si se requiere un motivo estado nuevo, marcarlo como **(NUEVO MOTIVO ESTADO A REGISTRAR)** y proponer: código, título corto, descripción, severidad, y en qué paso se dispara.
- **Artefactos suplementarios:** No sobrecargar el escenario con tablas extensas de campos, filtros o reglas. Referenciar los artefactos (documentos hijos) y documentar el detalle allí.
- **Bitácora:** Es OBLIGATORIA en todo escenario. Siempre documentar como último paso del flujo principal.
- **Validaciones de seguridad:** Son OBLIGATORIAS en todo escenario, sin excepción.
- **Validaciones por funcionalidad:** Adaptar según el caso (fechas, existencia, estados, dependencias, paginación, etc.).
