# Plantilla: Estructura de Datos

> Sustituye "nombre_tabla" por el nombre real de la estructura (snake_case, singular).

---

**Nombre:** nombre_tabla

**Descripción:** [Descripción breve del propósito de la tabla]

### Campos

| Nombre | Tipo de Datos | Longitud Máxima | Requerido | Consideración |
|--------|---------------|-----------------|-----------|---------------|
| nombre_tabla_id | bigserial | 5 | Sí | Código autoincremental de nombre_tabla. |
| entidad_id | bigint | 5 | No | Código que identifica la entidad del sistema. |
| descripcion | varchar | 50 | Sí | Descripción de nombre_tabla. |
| usuario_creacion_id | bigint | 5 | Sí | Usuario que creó el registro. |
| usuario_ultimo_cambio_id | bigint | 5 | No | Usuario que actualizó el registro. |
| fecha_creacion | timestamp | N/A | Sí | Fecha de creación del registro. |
| fecha_ultimo_cambio | timestamp | N/A | No | Fecha de actualización del registro. |
| estado | varchar | 2 | Sí | Estado del nombre_tabla. **Posibles Valores:** AC=Activo, IN=Inactivo. |

### Índices

| Nombre | ¿Único? | Columnas Involucradas | Secuencia | Orden |
|--------|---------|----------------------|-----------|-------|
| nombre_tabla_nombre_tabla_id_idx | Sí | nombre_tabla_id | 1 | N/A |
| nombre_tabla_entidad_id_idx | No | entidad_id | 1 | N/A |
| nombre_tabla_fecha_creacion_idx | No | fecha_creacion | 1 | N/A |
| nombre_tabla_usuario_creacion_id_idx | No | usuario_creacion_id | 1 | N/A |

### Foreign Keys

| Nombre | Columna Local | Esquema Ref. | Tabla Ref. | Columna Ref. |
|--------|--------------|-------------|-----------|-------------|
| nombre_tabla_entidad_id_fk | entidad_id | public | entidad | entidad_id |

### Constraints

| Nombre | Tipo | Columnas | Posibles Valores |
|--------|------|----------|-----------------|
| nombre_tabla_estado_ck | CHECK | estado | 'AC', 'IN' |
