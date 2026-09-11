# Modelo de Datos: Viaje

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|----------|-------------|-------------|
| Id | Guid | Sí | PK | Identificador del viaje |
| PasajeroId | Guid | Sí | FK (Pasajero) | Solicitante |
| ConductorId | Guid | No | FK (Conductor) | Conductor asignado (null si buscando) |
| OrigenLat | float | Sí | | Latitud recogida |
| OrigenLng | float | Sí | | Longitud recogida |
| DestinoLat | float | Sí | | Latitud destino |
| DestinoLng | float | Sí | | Longitud destino |
| Estado | string | Sí | Enum | Solicitado/Buscando/Asignado/EnCamino/Llego/EnCurso/Completado/Cancelado |
| TarifaEstimada | decimal | Sí | > 0 | Precio calculado antes de confirmar |
| MetodoPago | string | No | Efectivo/Tarjeta | Seleccionado al finalizar/iniciar |
| FechaSolicitud | datetime | Sí | | Hora de solicitud |
| FechaInicio | datetime | No | | Hora de inicio real |
| FechaFin | datetime | No | | Hora de fin |
