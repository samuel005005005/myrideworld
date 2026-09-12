---
description: Un modo por sesión y ahorro de tokens
alwaysApply: true
---
# Sesión, Modo y Consumo de Tokens

## 1. Un solo modo por sesión

| Modo | Rules / skills |
|------|----------------|
| Desarrollo | `modo-desarrollo` + `desarrollo-*` + conventions del lenguaje |
| Análisis | `modo-analisis` + `analisis-*` + skills `analisis-*` |
| Calidad | `modo-calidad` + `calidad-*` + skills `qa-*` |

**Prohibido:** mezclar modos (en análisis no escribas código de producto; en desarrollo no crees FERUs/escenarios; en calidad no implementes features).

Al responder tareas del modo: una línea `Modo activo: desarrollo | análisis | calidad`.

## 2. Ahorro de tokens

1. No leas rules/skills de otro modo.
2. No abras templates (`convention-*` largos, `skills/*/templates/*`, `references/*`) hasta necesitarlos.
3. Prefiere resumir y citar rutas en lugar de recopiar documentos.
4. En desarrollo: seguridad/logging/rendimiento/AWS solo si la tarea lo exige.

## 3. Contexto compartido (todos los modos)

- `contexto-proyecto.mdc`
- `seleccion-modo.mdc`
- `ops-comandos-usuario.mdc`
- `.agents/docs/cola-prompts.md` (checkpoint WIP)

## 4. Cola de prompts

| Comando | Efecto |
|---------|--------|
| `#retoma` | Lee la cola y continúa solo lo pendiente |
| `#guarda-cola` | Persiste checkpoint sin retomar |

CLI: `python scripts/cola_prompts.py status|resume`

Guardar checkpoint al cerrar una tarea o si el trabajo queda a medias. No en cada mensaje.
