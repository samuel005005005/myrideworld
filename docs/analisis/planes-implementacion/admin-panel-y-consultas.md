# Plan de Implementación: Panel de Administración y Consultas (GET)

## Objetivo
Proveer la infraestructura de back-office requerida para administrar conductores en la plataforma y permitir a las aplicaciones frontend visualizar los historiales de viajes.

## Endpoints Nuevos

### 1. Historial de Viajes (`GET /api/viajes`)
- **Roles:** `ADMIN`
- **Funcionalidad:** Retorna la lista paginada de todos los viajes registrados en el sistema.

### 2. Mis Viajes (`GET /api/viajes/mis-viajes`)
- **Roles:** `PASAJERO`, `CONDUCTOR`
- **Funcionalidad:** Retorna los viajes asociados al usuario autenticado.

### 3. Listar Conductores (`GET /api/conductores`)
- **Roles:** `ADMIN`
- **Funcionalidad:** Retorna la lista paginada de conductores, permitiendo filtrar por su estado de aprobación (ej. `?estadoAprobacion=Pendiente`).

### 4. Aprobar Conductor (`PATCH /api/conductores/:id/aprobar`)
- **Roles:** `ADMIN`
- **Funcionalidad:** Cambia el estado de aprobación de un conductor de `Pendiente` a `Aprobado`. Emite un evento en caso de ser necesario, pero por ahora solo muta la DB.

## Seguridad (Autenticación Administrador)
- En la ruta `/api/auth/login`, si el rol solicitado es `ADMIN`, el sistema verificará las credenciales contra variables de entorno (`ADMIN_EMAIL` y `ADMIN_PASSWORD`).
- Si coinciden, firmará un JWT con `{ sub: 'admin-1', rol: 'ADMIN' }`.
