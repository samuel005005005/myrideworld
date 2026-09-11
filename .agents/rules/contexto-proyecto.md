---
description: Contexto del proyecto: stack, equipo, ambientes, comandos
alwaysApply: true
---
# Contexto del Proyecto

## Información General

| Campo | Valor |
|-------|-------|
| **Nombre del proyecto** | TripTap World (migración multi-app) |
| **Descripción** | Plataforma de movilidad/pagos en vehículo. Este repo es **solo HQ de análisis** (sin código legacy). El sistema nuevo se desarrollará después y se desplegará en paralelo. |
| **Requerimiento activo** | [Plan greenfield](../../docs/analisis/planes-implementacion/plan-greenfield.md) · carpetas apiRest / app* |
| **Repositorio HQ** | `/Users/spaez/Documents/Desarrollo/dev-ch/archivos/triptap-world` |
| **Rama de trabajo** | main / feature según tarea |
| **Gestor de tareas** | Local (`docs/analisis/`) |
| **Formato de tareas** | Archivos Markdown en `docs/analisis/tareas/` |

---

## Enfoque

Ver [`docs/analisis/sistema/enfoque-trabajo.md`](../../docs/analisis/sistema/enfoque-trabajo.md): analizar primero → desarrollar después → deploy en paralelo. **No** traer código viejo a este repo. **No** strangler.

## Repos legacy (solo lectura para análisis; viven fuera de este repo)

| App | Ruta absoluta | Rol |
|-----|---------------|-----|
| API | `/Users/spaez/Documents/Desarrollo/dev-ch/archivos/triptap-api-hexagonal` | Backend REST + WebSocket + MongoDB |
| Conductor | `/Users/spaez/Documents/Desarrollo/dev-ch/archivos/triptap_drivers_app_flutter` | Flutter Drivers |
| Tablet | `/Users/spaez/Documents/Desarrollo/dev-ch/archivos/triptap_lite_tablet` | Flutter tablet (ads/entretenimiento + trip) |
| Cobro POS | `/Users/spaez/Documents/Desarrollo/dev-ch/archivos/triptap_p2` | Flutter cobro Sunmi P2 + Portal SDK (**legado**; greenfield = Banesco) |
| Ref. Banesco AppToApp | `/Users/spaez/Documents/Desarrollo/dev-ch/archivos/ddl_app` | Solo idea KinPOS Intent (Nexxus); **no** copiar código |
| Admin | `/Users/spaez/Documents/Desarrollo/dev-ch/archivos/triptap_admin_panel` | Next.js backoffice |

Mapa: [`docs/analisis/sistema/mapa-sistema.md`](../../docs/analisis/sistema/mapa-sistema.md)

---

## Equipo

| Rol | Persona | Email |
|-----|---------|-------|
| Analista / Assigned To | <!-- TODO --> | <!-- TODO --> |
| Desarrollo Backend | <!-- TODO --> | <!-- TODO --> |
| Desarrollo Frontend | <!-- TODO --> | <!-- TODO --> |
| SQA | <!-- TODO --> | <!-- TODO --> |
| Negocio / Monitoreo | <!-- TODO --> | <!-- TODO --> |
| Revisión documentación | <!-- TODO --> | <!-- TODO --> |
| Implementación (deploy) | <!-- TODO --> | <!-- TODO --> |

---

## Stack Tecnológico (legado vivo)

| Capa | Tecnología | Notas |
|------|-----------|-------|
| API | Node.js ≥20 + Express 4 + JS CommonJS | Entry `src/app.js`; nombre “hexagonal” ≠ runtime |
| BD | MongoDB + Mongoose 8 | Schemas en `src/database/schema/` |
| Realtime | `ws` (salas por `deviceId`) | Docs legacy a veces dicen Socket.IO |
| Drivers app | Flutter Dart ^3.6 + Provider | Package name legacy `customers` |
| Tablet | Flutter Dart ^3.6 + Provider + sqflite | Android (+ web) |
| POS cobro (legado) | Flutter + Kotlin MainActivity | Sunmi P2 + Portal SDK — **no** destino greenfield |
| Admin | Next.js 13 Pages + React 18 + TS/JS mix | Puerto dev 3013 |
| Archivos | AWS S3 | Upload API |
| Push / extras | Firebase Admin / FCM / Firestore | Service account en API |
| Auth | JWT multi-login por rol | Middleware permisivo (`jwt.decode` sin verify) — deuda |

### Stack destino (greenfield)

| Carpeta | Tecnología |
|---------|------------|
| `apiRest/` | NestJS + TypeScript |
| `appPayment/` | Kotlin (Android / **PAX** + Banesco App-to-App KinPOS); Portal `muerto` |
| `ddlApp/` | Kotlin (Android) — DDL Terminal Nexxus+Representantes; dual Portal\|Banesco; ≠ TripTap |
| `apptable/` | Kotlin (Android) |
| `appAdmin/` | Next.js + TypeScript |
| `appPayWeb/` | Next.js + TypeScript — pago QR + recibo (CyberSource) |
| `appdriver/` | Flutter (iOS + Android) — confirmado |

Plan: [`docs/analisis/planes-implementacion/plan-greenfield.md`](../../docs/analisis/planes-implementacion/plan-greenfield.md)

**Clean Architecture** (obligatoria en greenfield): `.agents/rules/desarrollo-convenciones-desarrollo.md` + `convention-*.md` + skill `dev-clean-architecture`. Se aplica en **modo Desarrollo** (no always-on).


---

## Infraestructura

| Campo | Valor |
|-------|-------|
| **Tipo de hosting** | Cloud |
| **Proveedor cloud** | AWS (+ DigitalOcean hosts legacy en clientes) |
| **API host conocido** | `https://dev.triptapmedia.com/api` (prod-like en clientes); local puerto `3131` |
| **IaC** | Por definir en migración |

| Recurso | Servicio | Descripción |
|---------|----------|-------------|
| API + WS | Node/Express | Hub de dominio |
| DB | MongoDB | Persistencia actual |
| Storage | S3 | Media/uploads |
| POS payments (legado) | Portal SDK / Sunmi | Evidencia histórica |
| POS payments (greenfield) | Banesco / KinPOS App-to-App en PAX | SALE + CLOSE auto + VOID |

---

## Comandos esenciales (legado)

| Acción | Comando / notas |
|--------|-----------------|
| API install/run | En API: `npm install` → `npm run dev` / `npm start` (`src/app.js`) |
| Drivers (legado) | `flutter pub get` → `flutter run` (+ `.env`) |
| Tablet (legado) | `flutter pub get` → `flutter run` |
| POS P2 (legado) | `flutter pub get` → build Android Sunmi (AARs Portal/PayLib) |
| apiRest (destino) | `cp .env.example .env` → `npm run start:dev` (PORT en `.env`) |
| appdriver (destino) | `cp .env.example .env` → `./scripts/run.sh` (`--dart-define-from-file=.env`) |
| apptable (destino) | `cp .env.example .env` → `./gradlew :app:installDebug` |
| appPayment (destino) | `cp .env.example .env` → Gradle/PAX; AAR KinPOS + mPOS Banesco |
| appPayWeb (destino) | `cp .env.example .env.local` → `npm run dev` (puerto **3014**) |
| Admin | `npm install` → `npm run dev` (puerto 3013) |
| Tests | Casi inexistentes en legado — exigirlos en el sistema nuevo |

---

## Tareas Activas

| ID | Tarea | Estado |
|----|-------|--------|
| `docs/analisis/tareas/completar-analisis-viajes.md` | Análisis Viajes+Cobro | Docs listos / dudoso |
| `docs/analisis/tareas/completar-analisis-drivers-auth.md` | Análisis Drivers+Auth | Docs listos / dudoso |
| `docs/analisis/tareas/migrar-datos-legacy-greenfield.md` | Migración Mongo legacy → GF | En progreso (v1+v2 script) |
| `docs/analisis/tareas/migrar-apppayment-banesco-apptoapp.md` | appPayment → Banesco AppToApp (PAX) | En progreso (capa nativa cableada) |
| `docs/analisis/escenarios/reproduccion-anuncios-tablet.md` | Paridad ads IMAGE/VIDEO tablet | Documentado + alineado apptable |
| `docs/analisis/tareas/mdm-tablets-headwind.md` | MDM gratis tablets (bloquear install/uninstall) | Pendiente |
| `docs/analisis/tareas/dual-adquirente-portal-banesco.md` | appPayment Portal\|Banesco build-time + Admin tipado | En progreso (Portal cableado; lab Sunmi) |
| `docs/analisis/tareas/presencia-persona-ad-played.md` | Presencia persona → AD_PLAYED (apptable + apiRest) | Hecho código / falta SQA física |

---

## Reglas para el agente

1. **Lee este archivo al inicio** de cada sesión para contexto.
2. **No inventes** stack, URLs, comandos ni módulos: si falta un TODO, pregunta.
3. **Actualiza este documento** cuando cambien tareas activas, stack o decisiones.
4. **Consulta los artefactos en `docs/analisis/`** cuando necesites detalle de análisis.
5. **Código legado:** solo lectura desde las rutas de arriba; **nunca** copiarlo a `triptap-world`.
6. **Al analizar**, aplicar `.agents/rules/migracion-extraccion-legacy.md` (`usado|dudoso|muerto`).
7. **No proponer implementación** hasta que el dominio tenga análisis completo en `docs/analisis/`.
8. **Al completar una tarea**, resume cambios y pregunta si actualizar `docs/analisis/tareas/`.
