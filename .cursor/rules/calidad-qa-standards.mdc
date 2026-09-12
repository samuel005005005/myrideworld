---
description: Estándares QA locales (planes/casos en Markdown + Playwright)
alwaysApply: false
---
# Estándares QA (MyRide)

## Contexto

QA trabaja sobre artefactos en `docs/analisis/` (requerimientos, escenarios, modelos). **No** hay Azure DevOps en este repo.

## Destino de artefactos QA

```
docs/analisis/calidad/
├── planes/          # Plan de pruebas por requerimiento/feature
├── casos/           # Casos de prueba (opcional si van embebidos en el plan)
└── evidencia/       # results.json + screenshots (o en el proyecto Playwright)
```

## Nomenclatura

- **Casos:** `CP - {acción a validar}`
- **Planes:** `plan-{slug-feature}.md` (ej. `plan-solicitud-asignacion-viaje.md`)
- **Suites lógicas:** una por Escenario de Uso en `docs/analisis/escenarios/`

## Formato de caso de prueba

Obligatorio: título, categoría (Positiva/Negativa), prioridad (1–4), precondiciones, pasos (acción + resultado esperado).

Primera precondición habitual: usuario autenticado con el rol adecuado (pasajero/conductor/admin).

## Estructura del plan

1. Objetivos de negocio
2. Misión del ciclo
3. Estrategia (funcionalidades, dimensiones, técnicas)
4. Alcance
5. Suites → lista de CP con trazabilidad al EU / US

## Tipos de prueba

Funcionales, integración (API + apps), regresión, datos, desempeño (si aplica).

## Idioma

Español.

## Evidencia local (Playwright)

```
evidence/{modulo}/
├── results.json
├── TC-001/step-01-....png
└── ...
```

Subida a Azure DevOps: **fuera de alcance** en MyRide.
