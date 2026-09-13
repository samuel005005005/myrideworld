# Plan de Implementación: Panel Asociación (backoffice operativo)

## Objetivo
Backoffice usable por la asociación: usuarios admin en BD con roles fijos, módulos de flota/tarifario/viajes/balances/bitácora/dashboard, y APIs asociadas.

## Roles admin (claim JWT `adminRol`; `rol` sigue siendo `ADMIN`)

| Rol | Puede |
|-----|--------|
| `SUPER_ADMIN` | Todo + gestionar usuarios admin |
| `OPERACIONES` | Flota, viajes, dashboard, config operativa |
| `FINANZAS` | Tarifario, balances/liquidación, config tarifaria |
| `AUDITOR` | Solo lectura: viajes, balances, bitácora, flota, dashboard |

## Auth admin
- Tabla `administradores` (nombre, email, passwordHash, rolAdmin, activo).
- Login `POST /api/auth/login` con `rol: ADMIN` consulta BD + bcrypt; JWT incluye `adminRol`.
- Seed SuperAdmin desde `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Fallback temporal env si aún no hay fila en BD (un release).

## Endpoints

### Administradores (`SUPER_ADMIN`)
- `GET/POST /api/administradores`
- `PATCH /api/administradores/:id`

### Flota
- `POST /api/conductores` — alta por asociación (`SUPER_ADMIN` | `OPERACIONES`); body incluye `password` y opcional `aprobarAlCrear`
- `GET /api/conductores?estado=`
- `PATCH /api/conductores/:id/aprobar|rechazar|suspender|reactivar`

### Tarifario OD
- `GET/POST /api/tarifas`
- `PATCH /api/tarifas/:id`
- `POST /api/tarifas/estimar` prioriza OD activa por `origenNombre`/`destinoNombre`; si no, fórmula base+km.

### Pagos / liquidación
- `GET /api/pagos-balances` (admin, filtros)
- `GET /api/pagos-balances/liquidacion`

### Bitácora
- `GET /api/bitacora` (filtros fecha/servicio/acción)

### Viajes
- `GET /api/viajes?estado=&desde=&hasta=` (admin + AdminRoles)
- `GET /api/viajes/:id` detalle

### Flota
- Lista incluye docs (`fotoUrl`, `licenciaUrl`, `seguroUrl`); UI “Ver docs”.
- Reactivar solo desde `Suspendido` (no desde Rechazado).

## Smoke asociación
Ver checklist en `docs/analisis/tareas/todo-analisis-mvp.md`.

Seed: SuperAdmin (`ADMIN_EMAIL`) + demos `ops@` / `finanzas@` / `auditor@myride.com` (misma password que SuperAdmin) + tarifas OD de ejemplo. Docs de flota en `/uploads/`.
