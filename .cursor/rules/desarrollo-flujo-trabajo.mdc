---
description: Flujo de trabajo local en desarrollo (sin Azure DevOps)
alwaysApply: false
---
# Flujo de Trabajo Local

## Propósito

Define cómo el agente trabaja una tarea de desarrollo usando solo artefactos del repositorio.

## Flujo

1. **Inicio:** El usuario indica una tarea o apunta a un archivo en `docs/analisis/`.
2. **Contexto:** Leer el requerimiento/escenario/método relacionados en `docs/analisis/` y `contexto-proyecto.md`.
3. **Desarrollo:** Implementar según los artefactos locales y las rules de desarrollo.
4. **Infraestructura (IaC):** Si hace falta, usar el stack definido en `contexto-proyecto.md`.
5. **Cierre:** Resumir cambios; actualizar README o docs solo si aplica. No hay cambio de estado en un tracker externo.

## Reglas

1. Leer los artefactos de análisis relacionados **antes** de escribir código.
2. Consultar `contexto-proyecto.md` para stack, repo y equipo.
3. Aplicar rules de desarrollo y conventions del lenguaje.
4. Si no hay artefacto de análisis, preguntar antes de asumir.
5. Al crear recursos nuevos (BD, S3, config, endpoints), actualizar o crear el plan en `docs/analisis/planes-implementacion/` si corresponde.
