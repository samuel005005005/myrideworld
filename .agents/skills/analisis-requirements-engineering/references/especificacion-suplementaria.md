# Plantilla: Especificación Suplementaria

> Sustituye los valores entre corchetes `[...]` por los datos reales.

---

### El sistema muestra los siguientes campos: (según modelo #[ID_MODELO])

| Nombre | Tipo de Datos | Longitud Máxima | Consideración |
|--------|---------------|-----------------|---------------|
| nombre | str | N/A | Nombre del modelo. |
| estado | str | 2 | Estado en el que se encuentra el modelo. |

### El sistema filtra por los siguientes criterios:

| Nombre | Tipo de Datos | Longitud Máxima | Consideración |
|--------|---------------|-----------------|---------------|
| fechaDesde | date | N/A | Este criterio está asociado al campo fechaCreacion. |
| fechaHasta | date | N/A | Este criterio está asociado al campo fechaCreacion. Esta fecha NO debe ser menor a fechaDesde. |
| descripcion | str | N/A | |

### Criterio de ordenamiento

- La información presentada será ordenada por **fechaCreacion** de manera descendente.
