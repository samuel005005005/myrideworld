# Lista de Tareas para Desarrollo MVP (TODO)

## Infraestructura y base

- [x] **Arquitectura:** Configurar entorno y repositorio (App Pasajero, App Conductor y Admin Web, Backend).
- [x] **Base de Datos:** Implementar modelos de datos definidos en `docs/analisis/modelos-datos/` (TypeORM; índices en conductores/viajes).
- [x] **API:** Implementar endpoints de autenticación y gestión de perfiles (Pasajero/Conductor/Admin).
- [x] **API:** Implementar módulo de tarifas estáticas (CRUD + estimar Haversine sin persistir por defecto).

## Flujo de viaje (API)

- [x] **API:** Flujo de solicitud de viaje y asignación escalonada (`AsignadorConductorService`, bbox + radio, rechazo → reasignar).
- [x] **API:** Máquina de estados de viaje (solicitar → aceptar atómico → iniciar/completar con ownership; GPS WS throttled).
- [ ] **API:** Validación de proximidad GPS al iniciar/completar (regla de negocio pendiente de endurecer).
- [ ] **API:** Integración pasarela de pagos y módulo de cálculo de balances.

## Seguridad / hardening backend (2026-09-12)

- [x] Ownership/IDOR en REST y WebSocket (JWT `sub`, salas por participante).
- [x] Secretos fail-fast (`JWT_SECRET`, admin env, `BATCH_SECRET`); sin defaults inseguros.
- [x] CORS por `CORS_ORIGINS`; `synchronize` off en producción; throttling global + login.
- [x] Idempotencia scoped por usuario; aceptar viaje con `UPDATE` condicional.
- [x] Upload documentos: ownership + límites Multer/MIME.
- [x] Tests unitarios backend en `tests/unit/` (38 passing).

## Apps cliente

- [ ] **Móvil Pasajero:** UI completa (Solicitud, tracking en vivo, pago, historial) — auth/sesión y core loop en progreso.
- [ ] **Móvil Conductor:** UI completa (Recepción escalonada, mapa/navegación, máquina de estados, balances).
- [ ] **Web Admin:** Panel (Gestión de usuarios, tarifario, visor de viajes y auditoría).

## Calidad

- [ ] **SQA:** Ejecutar caso de prueba E2E (Core Loop de SC-1 en Requerimiento).
- [ ] Smoke manual: seed + backend con env completo + apps pasajero/conductor.
