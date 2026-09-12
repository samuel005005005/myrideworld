# Plantilla: Modelo de Datos

> Sustituye "NombreTabla" por el nombre real del modelo (PascalCase).
> Título del documento y nombre del modelo deben ser idénticos (PascalCase).

---

**Nombre:** NombreTabla

**Descripción:** [Descripción funcional breve, sin detalles técnicos]

### Campos

| Nombre | Tipo | Longitud | Requerido | Consideración |
|--------|------|----------|-----------|---------------|
| nombreTablaId | int | 5 | Sí | Código autoincremental de NombreTabla. |
| entidadId | int | 5 | Sí | Código que identifica la entidad del sistema. |
| descripcion | str | 50 | Sí | Descripción de NombreTabla. |
| usuarioCreacionId | int | 5 | Sí | Usuario que creó el registro. |
| usuarioUltimoCambioId | int | 5 | No | Usuario que actualizó el registro. |
| fechaCreacion | datetime | N/A | Sí | Fecha de creación del registro. |
| fechaUltimoCambio | datetime | N/A | No | Fecha de actualización del registro. |
| estado | str | 2 | Sí | Estado del NombreTabla. **Posibles Valores:** AC=Activo, IN=Inactivo. |
