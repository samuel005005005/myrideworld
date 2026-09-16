# Lista de Tareas — Producto asociación / MVP técnico

## Producto asociación (backoffice operativo)

- [x] **Admin RBAC:** entidad `administradores`, login BD + claim `adminRol`, `AdminRolesGuard`, seed SuperAdmin.
- [x] **API flota:** rechazar / suspender / reactivar conductores (+ estado Suspendido).
- [x] **API bitácora:** `GET /api/bitacora` con filtros.
- [x] **API pagos admin:** listado + `GET /api/pagos-balances/liquidacion`.
- [x] **API dashboard:** `GET /api/admin/dashboard`.
- [x] **API pasajeros:** `GET /api/pasajeros` admin.
- [x] **API tarifario OD:** CRUD tarifas + estimar prioriza OD activa.
- [x] **Tarifa plana Cap Cana:** viajes con origen y destino dentro de Cap Cana → precio fijo (seed USD 4) configurable en Admin; fuera/mixtos → OD o fórmula. Geocerca Cap Cana editable. (BR-TAR-001..003, US-1.3.5)
- [x] **Web-admin:** dashboard, flota (alta + gestión), tarifario, viajes, balances, bitácora, usuarios admin, config + RBAC UI.
- [x] **Alta conductor asociación:** `POST /api/conductores` solo admin; formulario en Flota; sin auto-registro público.
- [x] **Apps polish:** tracking pasajero (llamar real / sin botones muertos); mensajes proximidad conductor.

### Checklist smoke asociación

1. API: `cd backend && npm run build && npm run seed && npm run start:dev`
2. Admin: `cd web-admin && npm run dev` → http://localhost:5174 (o 5173)
3. Login SuperAdmin: `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env` (seed también crea demos con la misma password):
   - `ops@myride.com` → OPERACIONES
   - `finanzas@myride.com` → FINANZAS
   - `auditor@myride.com` → AUDITOR
4. Verificar nav por rol (ops sin tarifario/usuarios; auditor solo lectura).
5. Flota: **Nuevo conductor** (alta admin); aprobar / rechazar / suspender / reactivar; “Ver docs” abre `/uploads/...`.
6. Tarifario: OD sembradas (Aeropuerto↔Bávaro, etc.); alta/edición; estimar con nombres OD.
7. Completar un viaje (apps) → Balances + Bitácora.
8. Dashboard: contadores con conductores conectados / viaje activo.
9. Conductor: oferta con timbre (socket + FCM). Requiere `FIREBASE_*` dart-defines en la app y `FIREBASE_SERVICE_ACCOUNT_JSON` (o `GOOGLE_APPLICATION_CREDENTIALS`) en el backend + `google-services.json` en Android.
10. Conductor en línea: envía GPS al conectarse + heartbeat 20s; timeout oferta `TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS` (seed 30s) rota al siguiente.

## Infraestructura y base

- [x] **Arquitectura:** Configurar entorno y repositorio (App Pasajero, App Conductor y Admin Web, Backend).
- [x] **Base de Datos:** Implementar modelos de datos definidos en `docs/analisis/modelos-datos/` (TypeORM; índices en conductores/viajes).
- [x] **API:** Implementar endpoints de autenticación y gestión de perfiles (Pasajero/Conductor/Admin).
- [x] **API:** Implementar módulo de tarifas estáticas (CRUD + estimar Haversine sin persistir por defecto).
- [x] **API:** Parámetros `TARIFA_BASE` / `TARIFA_KM` / `TARIFA_MINIMA` vía configuración (seed + admin); estimar falla si no están definidos (sin defaults quemados en el use case).
- [x] **API Admin:** `GET/PATCH /api/configuracion` (rol ADMIN) para listar/actualizar tarifas y demás parámetros.

## Flujo de viaje (API)

- [x] **API:** Flujo de solicitud de viaje y asignación escalonada.
- [x] **API:** Máquina de estados de viaje + GPS WS throttled.
- [x] **API:** Validación de proximidad GPS (`RADIO_PROXIMIDAD_*_M`).
- [ ] **API:** Pasarela de pagos online (fase 2; liquidación efectivo ya disponible).

## Seguridad / hardening backend

- [x] Ownership/IDOR, secretos fail-fast, CORS, throttling, idempotencia, uploads.
- [x] Tests unitarios backend en `tests/unit/`.

## Apps cliente

- [x] **Móvil Pasajero:** core loop + perfil/historial/pagos efectivo/ayuda; tracking con llamada real.
- [x] **Móvil Conductor:** auth/sesión/realtime, GPS, balances, historial; UX proximidad.
- [x] **Web Admin:** panel asociación con RBAC (no solo env-admin).

## Pureza Clean Architecture

- [x] Flutter dominio limpio; SessionStorage seguro; sin auto-login.
- [x] Backend dominio limpio.
- [ ] Backend aplicación: quitar Nest de use cases/DTOs (epic).
- [x] Web-admin: UI fina sobre API.

## Mandato producto

**Cero flujos fake.** Regla: `.cursor/rules/desarrollo-cero-flujos-fake.mdc`.

- [ ] Pasarela tarjeta / cobro online (fuera de esta fase).

## Calidad

- [ ] **SQA:** E2E Core Loop SC-1.
- [ ] Smoke manual asociación: checklist arriba + apps.
