# Modelo de Datos: Tarifa

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|----------|-------------|-------------|
| Id | Guid | Sí | PK | Identificador |
| Origen | string | Sí | | Nombre/Polígono del origen |
| Destino | string | Sí | | Nombre/Polígono del destino |
| Precio | decimal | Sí | > 0 | Precio fijo |
| Estado | string | Sí | Activo/Inactivo | Si está vigente |
