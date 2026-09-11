---
description: Tests, cobertura 80%, README, artefactos de entrega
alwaysApply: false
---
# Controles de Calidad

## Propósito

Reglas de verificación automática antes de considerar una tarea completa.

---

## Checklist Obligatorio

| # | Control | Criterio |
|---|---------|----------|
| 1 | Tests unitarios existen | Todo código nuevo tiene tests |
| 2 | Tests pasan | 0 tests fallidos |
| 3 | Cobertura mínima | >= 80% en código nuevo |
| 4 | README actualizado | Si cambia algo visible (endpoints, config, vars) |
| 5 | Sin TODOs sueltos | Todo TODO debe referenciar una tarea o doc en `docs/analisis/` |
| 6 | Sin secretos expuestos | No passwords/tokens en código |
| 7 | Lint sin errores | Linter del proyecto pasa |
| 8 | Imports limpios | Sin imports no usados |

---

## Cobertura por Capa

| Capa | Mínimo |
|------|--------|
| Dominio (entidades, value objects) | 90% |
| Aplicación (use cases) | 85% |
| Infraestructura (repositorios) | 70% |
| Presentación (controllers) | 60% |

---

## Reglas para el Agente

1. Después de escribir código, escribir tests.
2. Ejecutar tests antes de presentar resultado.
3. Actualizar README si se agregan endpoints, variables, o config.
4. No dejar imports sin usar.
5. No reducir cobertura existente.
6. Lint antes de commit.
