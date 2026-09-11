# Modelo de Datos: Pago y Balance

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|----------|-------------|-------------|
| Id | Guid | Sí | PK | |
| ViajeId | Guid | Sí | FK (Viaje) | |
| ConductorId | Guid | Sí | FK (Conductor) | |
| MontoBruto | decimal | Sí | > 0 | Valor del viaje |
| FeeProcesamiento | decimal | Sí | >= 0 | 7.5% si es Tarjeta, 0 si Efectivo |
| MontoNeto | decimal | Sí | >= 0 | Bruto - Fee |
| Metodo | string | Sí | Efectivo/Tarjeta | |
| Fecha | datetime | Sí | | |
