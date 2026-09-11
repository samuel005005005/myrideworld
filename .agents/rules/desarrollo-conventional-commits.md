---
description: Conventional Commits en español (flujo local, sin Azure DevOps)
alwaysApply: false
---
# Conventional Commits en Español

## Propósito

Define el formato obligatorio de commits: Conventional Commits en español.

---

## Formato Obligatorio

```
<tipo>(<alcance>): <descripción>
```

### Ejemplos

```
feat(autenticación): agregar login con doble factor
fix(pagos): corregir cálculo de IVA en facturas
docs(api): actualizar documentación de endpoints
build(deps): actualizar dependencias de seguridad
```

---

## Tipos Permitidos

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de error |
| `docs` | Cambios solo en documentación |
| `style` | Formato, punto y coma faltante, etc. (no afecta lógica) |
| `refactor` | Refactorización de código (no agrega ni corrige funcionalidad) |
| `perf` | Mejora de rendimiento |
| `test` | Agregar o corregir tests |
| `build` | Cambios en sistema de build o dependencias externas |
| `ci` | Cambios en configuración de CI/CD |
| `chore` | Tareas de mantenimiento (no afectan código fuente ni tests) |
| `revert` | Revierte un commit anterior |

---

## Reglas

### 1. Descripción en Español

- La descripción del commit debe estar en **español**.
- Usar **imperativo**: "agregar", "corregir", "eliminar", "actualizar".
- No usar mayúscula inicial en la descripción.
- No terminar con punto.
- Máximo 100 caracteres en la primera línea.

### 2. Alcance (Scope) Opcional pero Recomendado

- Indica el módulo o área afectada: `auth`, `pagos`, `usuarios`, `api`, `db`, etc.
- Usar nombres cortos y consistentes en todo el proyecto.

### 3. Cuerpo del Commit (Opcional)

```
feat(usuarios): implementar exportación de usuarios a CSV

Se agrega endpoint para exportar la lista de usuarios activos
en formato CSV. Incluye filtros por fecha de registro y rol.

Campos exportados: nombre, email, rol, fecha_registro
```

### 4. Breaking Changes

```
feat(api)!: cambiar estructura de respuesta de paginación

BREAKING CHANGE: el campo `data` ahora se llama `items` y se agrega
metadata de paginación en el campo `pagination`.
```

---

## Ejemplos Válidos

```
feat(auth): agregar autenticación con OAuth2
fix(carrito): corregir duplicación de productos al agregar
docs(api): actualizar documentación de endpoints de pagos
refactor(usuarios): extraer validación a servicio dedicado
test(pedidos): agregar tests unitarios para cálculo de envío
perf(consultas): optimizar query de reporte mensual
build(deps): actualizar dependencias de seguridad
ci(deploy): configurar pipeline de staging
chore(scripts): agregar script de migración de datos
```

## Ejemplos Inválidos

```
❌ "arreglé el bug del login"                 → Sin tipo
❌ "feat: add user login"                     → Descripción en inglés
❌ "fix(auth): Corregir error"                → Mayúscula inicial
❌ "feat(auth): agregar login."               → Punto final
```
