---
name: dev-plan-implementacion
description: Crea y mantiene el Plan de Implementación como Markdown local en docs/analisis/planes-implementacion/ (pasos de infra, deploy, BD, config). Use when planning production rollout or creating plan de pase/despliegue.
---

# Plan de Implementación (local)

## Purpose

Documentar en el repo todos los pasos necesarios para llevar un cambio a producción.

## Use this skill when

- El usuario menciona "plan de implementación", "plan de pase", "plan de despliegue".
- Se necesita documentar pasos de infraestructura, deploy, BD, configuración.
- Se completa un desarrollo y se necesita planificar el pase a producción.

## Preguntas

| # | Pregunta |
|---|----------|
| 1 | ¿Cuál es el requerimiento padre? (ruta en `docs/analisis/requerimientos/`) |
| 2 | ¿Quiénes participan? (Analista, Dev, SQA, Integrador, Ops, DBA, Infra, Arquitectura) |
| 3 | ¿Propósito del cambio? |
| 4 | ¿Alcance? |
| 5 | ¿Qué servicios/recursos se crean o modifican? |
| 6 | ¿Hay cambios de BD? |
| 7 | ¿Hay PRs involucrados? |
| 8 | ¿Qué entidades/clientes se ven afectados? |
| 9 | ¿Riesgos? |
| 10 | ¿Plan de rollback? |

## Instrucciones

1. Crear o actualizar `docs/analisis/planes-implementacion/<nombre>.md`.
2. Vincular al requerimiento con ruta relativa.
3. Incluir: participantes, propósito, alcance, tabla de pasos (orden, actividad, responsable, cuenta/servicio), riesgos, contingencia/rollback.
4. Referenciar el REQ padre en la tabla de actividades.
5. Mostrar vista previa y esperar confirmación antes de escribir.

## Estructura sugerida del Markdown

```markdown
# Plan de Implementación: <título>

**Requerimiento:** [link](../requerimientos/...)

## Participantes
| Rol | Persona |

## Propósito
...

## Alcance
...

## Pasos
| # | Actividad | Responsable | Servicio/Recurso | Notas |
|---|-----------|-------------|------------------|-------|

## Riesgos
...

## Contingencia / Rollback
...
```
