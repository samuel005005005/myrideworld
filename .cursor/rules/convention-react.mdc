---
description: Convenciones React Clean Architecture feature-first
globs: **/*.{tsx,jsx}
alwaysApply: false
---
# Estructura Base - React con Clean Architecture

## Propósito

Define la estructura para proyectos React (Vite, Next.js, CRA) siguiendo feature-first con capas limpias. Se activa automáticamente al trabajar con archivos `.tsx`/`.jsx`.

---

## Estructura de Proyecto - React + Vite

```
📁 src/
├── 📁 core/                               # Singleton: auth, http client, config
│   ├── 📁 http/
│   │   └── http-client.ts
│   ├── 📁 auth/
│   │   ├── auth.context.tsx
│   │   └── auth.provider.tsx
│   └── 📁 config/
│       └── env.config.ts
│
├── 📁 shared/                             # Componentes y utilidades reutilizables
│   ├── 📁 components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Modal/
│   ├── 📁 hooks/
│   │   └── useDebounce.ts
│   ├── 📁 utils/
│   └── 📁 types/
│
├── 📁 features/                           # Módulos por feature
│   └── 📁 usuarios/
│       ├── 📁 domain/
│       │   ├── entities/
│       │   │   └── usuario.entity.ts
│       │   └── repositories/
│       │       └── usuario.repository.ts
│       ├── 📁 application/
│       │   ├── use-cases/
│       │   │   └── crear-usuario.use-case.ts
│       │   └── dto/
│       │       └── usuario.dto.ts
│       ├── 📁 infrastructure/
│       │   ├── repositories/
│       │   │   └── usuario.repository.impl.ts
│       │   └── mappers/
│       │       └── usuario.mapper.ts
│       ├── 📁 presentation/
│       │   ├── pages/
│       │   │   └── UsuariosPage.tsx
│       │   ├── components/
│       │   │   ├── UsuarioCard.tsx
│       │   │   └── UsuarioForm.tsx
│       │   └── hooks/
│       │       └── useUsuarios.ts
│       └── index.ts                       # Barrel export del feature
│
├── 📁 router/
│   └── AppRouter.tsx
│
├── App.tsx
└── main.tsx

📁 tests/
├── 📁 unit/
└── 📁 integration/
```

---

## Convenciones React

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Componentes | PascalCase (archivo y componente) | `UsuarioCard.tsx` |
| Hooks | camelCase con prefijo `use` | `useUsuarios.ts` |
| Páginas | PascalCase + Page | `UsuariosPage.tsx` |
| Contextos | PascalCase + Context | `AuthContext.tsx` |
| Utils/helpers | camelCase | `formatDate.ts` |
| Tipos/interfaces | PascalCase | `UsuarioProps` |
| Carpetas de componentes | PascalCase | `Button/` |
| Archivos de feature | kebab-case + sufijo | `crear-usuario.use-case.ts` |

---

## Librerías Recomendadas

| Librería | Propósito |
|----------|-----------|
| `React` 18+ | UI |
| `React Router` v6 | Routing |
| `TanStack Query` | Data fetching + cache |
| `Zustand` / `Jotai` | State management ligero |
| `Zod` | Validación de schemas |
| `Axios` / `ky` | HTTP client |
| `Vitest` + `Testing Library` | Testing |
| `Tailwind CSS` | Estilos |

---

## Tipado TypeScript (appAdmin y React)

**Prohibido `Record<>`**. Misma regla que `convention-typescript.md`:
- Mapas con claves conocidas → tipos mapeados `{ readonly [K in X]: … }` o interfaz fija.
- Cabeceras HTTP / diccionarios string→string → `MapaString` (`{ [clave: string]: string }`).
- Objeto JSON desconocido → `ObjetoIndice` (`{ [clave: string]: unknown }`) o interfaz dedicada.
- Preferir `as const` + tipo derivado cuando el mapa sea catálogo estático.

---

## Reglas para el Agente

1. **Feature-first**. Agrupar por funcionalidad, no por tipo de archivo.
2. **Custom hooks** para lógica reutilizable. No lógica compleja dentro de componentes.
3. **Componentes pequeños**. Si supera 100 líneas, dividir en subcomponentes.
4. **Props tipadas** con interface o type. No usar `any`.
5. **TanStack Query** (o similar) para server state. No useState para datos del servidor.
6. **Barrel exports** (`index.ts`) por feature para encapsular la implementación interna.
7. **Separar presentación de lógica**. Container/Presentational pattern o custom hooks.
8. **No acceder a infraestructura desde componentes**. Pasar por use-cases o hooks.
9. **Lazy loading** de features con `React.lazy()` + `Suspense`.
10. **Tests** con Testing Library (comportamiento del usuario, no detalles de implementación).
