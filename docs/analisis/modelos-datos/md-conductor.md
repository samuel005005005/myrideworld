# Modelo de Datos: Conductor

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|----------|-------------|-------------|
| Id | Guid | Sí | PK | Identificador único |
| NombreCompleto | string | Sí | Max 100 chars | Nombre del conductor |
| Email | string | Sí | Unique, valid email | Correo |
| Telefono | string | Sí | | Teléfono |
| FotoUrl | string | No | URL | Foto de perfil |
| VehiculoMarca | string | Sí | | Marca del vehículo |
| VehiculoModelo | string | Sí | | Modelo del vehículo |
| VehiculoColor | string | Sí | | Color |
| VehiculoPlaca | string | Sí | Unique | Matrícula / Placa |
| EstadoAprobacion | string | Sí | Pendiente/Aprobado/Rechazado/Suspendido | Aprobación por admin (Suspendido = flota pausada) |
| EstadoDisponibilidad | string | Sí | Conectado/Desconectado/Ocupado | Estado de operación |
| LicenciaUrl | string | No | URL/ruta | Documento de licencia |
| SeguroUrl | string | No | URL/ruta | Documento de seguro |
| UltimaUbicacionLat | float | No | | Última latitud conocida |
| UltimaUbicacionLng | float | No | | Última longitud conocida |
