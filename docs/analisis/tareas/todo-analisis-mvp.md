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

- [ ] **Móvil Pasajero:** UI completa (pago, historial real, perfil editable) — core loop solicitud/tracking/recibo ya cableado.
- [ ] **Móvil Conductor:** UI completa (mapa/navegación real, balances) — auth/sesión/realtime Clean Arch alineado con pasajero.
- [ ] **Web Admin:** Panel (Gestión de usuarios, tarifario, visor de viajes y auditoría) — sin capas CA aún.

## Pureza Clean Architecture (2026-09-12)

- [x] Flutter dominio: sin Equatable/frameworks; token fuera de entidades; `data/` = infraestructura.
- [x] Pasajero + Conductor: SessionStorage seguro, NetworkInfo, gateway realtime, router guards, sin auto-login.
- [x] Backend **dominio**: limpio (sin Nest/TypeORM).
- [ ] Backend **aplicación**: quitar `@Injectable`/`@ApiProperty`/`zod+swagger` de use cases/DTOs → composition root + presentacion (epic).
- [ ] Web-admin: introducir capas o mantener como UI fina sobre API (decidir).

## Móvil Pasajero — infra / seguridad / Clean Arch (2026-09-12)

- [x] Capa infra: `SessionStorage` (secure) + `NetworkInfo` + Dio con 401/cleanup.
- [x] Auth: sesión restore/logout; JWT fuera del dominio; sin auto-login ni password en `.env`.
- [x] Router guards (rutas protegidas vs login/welcome).
- [x] Realtime: puerto `ViajeRealtimeGateway` + `ViajeSocketDataSource` en data.
- [x] Tarifas en dominio (`CalculadoraTarifa`); HomeState/widgets separados.
- [x] Tests unitarios: `LoginUseCase`.
- [x] Eliminada `CalculadoraTarifa` hardcodeada; UI muestra tarifa pendiente de API.
- [ ] Cablear estimar tarifa desde backend (`tarifas` / configuración) en home.
- [ ] Features stub: perfil/pagos/soporte con domain+data (hoy solo presentation).
- [ ] Quitar `.env` como asset en release / usar `--dart-define` o flavors.

## Móvil Conductor — infra / seguridad / Clean Arch (2026-09-12)

- [x] Misma línea que pasajero: secure session, NetworkInfo, gateway socket, login real, guards.
- [x] Eliminado `DemoCredentials` / auto-login y `SocketService` en core.
- [x] Test `IniciarSesion`.
- [ ] Logout en UI home; GPS real (hoy simulado).

## Calidad

- [ ] **SQA:** Ejecutar caso de prueba E2E (Core Loop de SC-1 en Requerimiento).
- [ ] Smoke manual: seed + backend con env completo + apps pasajero/conductor (login manual obligatorio).
