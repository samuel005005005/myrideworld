---
description: Cómo QA consume artefactos de análisis locales
alwaysApply: false
---
# Integración QA con Análisis (local)

## Jerarquía en este repo

```
docs/analisis/
├── requerimientos/     → contexto / US / BR
├── feru/               → interpretación e impacto
├── escenarios/         → fuente principal de test cases
├── metodos/            → contratos API (si existen)
├── estructuras-datos/  → campos físicos
├── modelos-datos/      → campos API / dominio
├── especificaciones/   → suplementarias
└── calidad/            → planes y evidencia QA
```

## Mapeo Análisis → QA

| Artefacto | Uso QA |
|-----------|--------|
| Criterios Given/When/Then del EU | CP Positiva/Negativa |
| Métodos (URI, errores) | mocks `page.route` / assertions API |
| Modelos / estructuras | datos de prueba y boundaries |
| FERU / REQ | alcance y prioridad |

Camino feliz → CP Positiva (P1). Validación/auth → CP Negativa (P2). Borde → P3.

## Cómo navegar

1. Leer REQ/FERU activos en `contexto-proyecto`.
2. Abrir EUs relacionados en `escenarios/`.
3. Seguir links a métodos/modelos.
4. Generar plan en `docs/analisis/calidad/planes/`.
