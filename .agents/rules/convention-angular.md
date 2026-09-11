---
description: Convenciones Angular Clean Architecture (standalone, signals)
globs: **/*.component.ts
alwaysApply: false
---
# Estructura Base - Angular con Clean Architecture

## Propósito

Define la estructura para proyectos Angular 17+ siguiendo feature-first con standalone components y signals. Se activa al trabajar con archivos `.component.ts`.

---

## Estructura de Proyecto - Angular 17+ Standalone

```
📁 src/app/
├── 📁 core/                               # Servicios singleton, guards, interceptors
│   ├── 📁 interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── 📁 guards/
│   │   └── auth.guard.ts
│   ├── 📁 services/
│   │   ├── auth.service.ts
│   │   └── storage.service.ts
│   └── 📁 tokens/
│       └── injection-tokens.ts
│
├── 📁 shared/                             # Componentes, pipes, directivas compartidas
│   ├── 📁 components/
│   │   ├── loading-spinner/
│   │   ├── confirm-dialog/
│   │   └── data-table/
│   ├── 📁 pipes/
│   │   └── date-format.pipe.ts
│   ├── 📁 directives/
│   └── 📁 validators/
│       └── custom-validators.ts
│
├── 📁 features/                           # Módulos por feature (lazy loaded)
│   └── 📁 usuarios/
│       ├── 📁 domain/
│       │   ├── entities/
│       │   │   └── usuario.entity.ts
│       │   └── repositories/
│       │       └── usuario.repository.ts  # Interface abstracta
│       ├── 📁 application/
│       │   ├── use-cases/
│       │   │   ├── crear-usuario.use-case.ts
│       │   │   └── listar-usuarios.use-case.ts
│       │   └── dto/
│       │       └── usuario.dto.ts
│       ├── 📁 infrastructure/
│       │   └── repositories/
│       │       └── usuario-http.repository.ts
│       ├── 📁 presentation/
│       │   ├── pages/
│       │   │   ├── usuarios-list/
│       │   │   │   ├── usuarios-list.component.ts
│       │   │   │   └── usuarios-list.component.html
│       │   │   └── usuario-detail/
│       │   ├── components/
│       │   │   ├── usuario-card/
│       │   │   └── usuario-form/
│       │   └── store/                     # Signal store del feature
│       │       └── usuarios.store.ts
│       ├── usuarios.routes.ts
│       └── index.ts
│
├── 📁 layouts/
│   ├── main-layout/
│   └── auth-layout/
│
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

---

## Convenciones Angular

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Componentes | kebab-case (selector + archivos) | `usuario-card.component.ts` |
| Servicios | PascalCase + Service | `UsuarioService` |
| Guards | PascalCase + Guard | `AuthGuard` |
| Interceptors | PascalCase + Interceptor | `ErrorInterceptor` |
| Pipes | PascalCase + Pipe | `DateFormatPipe` |
| Use Cases | PascalCase + UseCase | `CrearUsuarioUseCase` |
| Stores | PascalCase + Store | `UsuariosStore` |
| Selectores | `app-` prefix | `app-usuario-card` |

---

## Librerías Recomendadas

| Librería | Propósito |
|----------|-----------|
| Angular 17+ | Framework (standalone) |
| Angular Signals | Reactividad |
| `@ngrx/signals` | Signal Store |
| RxJS | Streams (HTTP, eventos) |
| Zod | Validación runtime |
| Angular Material / Tailwind | UI |
| Jest / Vitest | Unit testing |
| Cypress / Playwright | E2E |

---

## Reglas Específicas Angular

1. **Standalone components** por defecto. No crear NgModules nuevos.
2. **Signals** para estado local. RxJS para streams/eventos.
3. **Lazy loading** de features con `loadChildren` en routes.
4. **Inject()** function sobre constructor injection cuando sea posible.
5. **Signal Store** (`@ngrx/signals`) para estado del feature.
6. **Interfaces abstractas** para repositorios, proveer implementación en routes.
7. **Functional guards e interceptors** sobre class-based.
8. **OnPush** change detection en todos los componentes.
9. **Tipado estricto** en templates (`strictTemplates: true`).
10. **Barrel exports** por feature. No importar archivos internos de otro feature.
