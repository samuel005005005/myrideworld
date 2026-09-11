---
description: Convenciones JavaScript ES Modules Clean Architecture
globs: **/*.{js,mjs,cjs}
alwaysApply: false
---
# Estructura Base - JavaScript (ES Modules)

## Propósito

Define la estructura para proyectos JavaScript puro (sin TypeScript) siguiendo Clean Architecture. Se aplica a APIs con Express, utilidades y scripts Node.js.

---

## Estructura de Proyecto - Express + Clean Arch

```
📁 src/
├── 📁 domain/
│   ├── 📁 entities/
│   │   └── usuario.entity.js
│   ├── 📁 repositories/
│   │   └── usuario.repository.js          # JSDoc con @typedef para interfaz
│   ├── 📁 exceptions/
│   │   └── domain.exception.js
│   └── 📁 value-objects/
│       └── email.value-object.js
│
├── 📁 application/
│   ├── 📁 use-cases/
│   │   ├── crear-usuario.use-case.js
│   │   └── obtener-usuario.use-case.js
│   ├── 📁 dto/
│   │   └── usuario.dto.js
│   └── 📁 mappers/
│       └── usuario.mapper.js
│
├── 📁 infrastructure/
│   ├── 📁 persistence/
│   │   ├── 📁 models/
│   │   │   └── usuario.model.js
│   │   ├── 📁 repositories/
│   │   │   └── usuario.repository.impl.js
│   │   └── database.config.js
│   ├── 📁 services/
│   │   └── email.service.impl.js
│   └── 📁 config/
│       └── env.config.js
│
├── 📁 presentation/
│   ├── 📁 routes/
│   │   └── usuarios.routes.js
│   ├── 📁 controllers/
│   │   └── usuarios.controller.js
│   ├── 📁 middlewares/
│   │   ├── error-handler.middleware.js
│   │   └── validator.middleware.js
│   └── 📁 schemas/                        # Validación con Joi/Zod
│       └── usuario.schema.js
│
├── 📁 shared/
│   └── 📁 utils/
│
├── app.js                                 # Configuración Express
└── server.js                              # Entry point

📁 tests/
├── 📁 unit/
├── 📁 integration/
└── setup.js
```

---

## Convenciones

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Archivos | kebab-case + sufijo | `crear-usuario.use-case.js` |
| Clases | PascalCase | `UsuarioRepository` |
| Funciones | camelCase | `obtenerPorId()` |
| Variables | camelCase | `nombreCompleto` |
| Constantes | UPPER_SNAKE_CASE | `MAX_REINTENTOS` |
| Módulos | ES Modules (`import/export`) | Preferido sobre CommonJS |

---

## Reglas para el Agente

1. **JSDoc para tipos** cuando no hay TypeScript. Documentar parámetros y retornos.
2. **ES Modules** (`import/export`) sobre CommonJS (`require`) cuando el proyecto lo soporte.
3. **Validación con Joi o Zod** en la capa de presentación.
4. **Sin TypeScript no significa sin estructura**. Mantener las capas separadas.
5. **Mismas reglas de Clean Architecture** que TypeScript pero con clases/funciones JS.
6. **`"type": "module"`** en package.json para habilitar ESM.
