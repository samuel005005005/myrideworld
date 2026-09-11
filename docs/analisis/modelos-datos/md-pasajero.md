# Modelo de Datos: Pasajero

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|----------|-------------|-------------|
| Id | Guid | Sí | PK | Identificador único del pasajero |
| NombreCompleto | string | Sí | Max 100 chars | Nombre del pasajero |
| Email | string | Sí | Unique, valid email | Correo de registro |
| Telefono | string | Sí | | Teléfono de contacto |
| PasswordHash | string | Sí | | Hash de contraseña |
| FechaRegistro | datetime | Sí | | Fecha de creación de la cuenta |
| Estado | string | Sí | Activo/Inactivo | Estado de la cuenta |
