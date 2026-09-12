---
description: Crear plan de pruebas Markdown desde docs/analisis
alwaysApply: false
---
# Flujo: Crear Plan de Pruebas (local)

## Trigger

- "Créame el plan de pruebas de {feature/EU/REQ}"
- "Plan de pruebas para solicitud de viaje"
- "Trabajame la parte de QA de este requerimiento"

## Flujo

1. **Leer** REQ/FERU + escenarios + modelos/métodos en `docs/analisis/`.
2. **Una suite por EU** (nombre = título del escenario).
3. **Derivar CP** de criterios de aceptación y flujos alternos (preguntar si aplican negativos/regresión si no está claro).
4. **Escribir** `docs/analisis/calidad/planes/plan-{slug}.md` con objetivos, alcance, suites y CP (pasos + resultado esperado).
5. **Trazabilidad:** cada CP cita `eu-*.md` / US-*.
6. Resumir al usuario; no crear work items externos.

## Prohibido

Crear specs Kiro (`requirements.md`/`design.md`/`tasks.md`) ni tickets en Azure.
