---
description: Activa modo Calidad (SQA): pruebas, validación, aseguramiento
alwaysApply: false
---
# Modo Calidad (SQA)

Cuando el usuario elija **modo Calidad**, lee y aplica:

- `.agents/rules/calidad-qa-standards.md`
- `.agents/rules/calidad-integracion-analisis.md`
- `.agents/rules/calidad-flujo-qa-end-to-end.md`
- `.agents/rules/calidad-flujo-plan-pruebas.md` (al crear planes)

Skills: `qa-generar-codigo-playwright`, `qa-ejecutar-pruebas-evidencia`, `qa-validar-aprobacion`.

Insumos: `docs/analisis/` (REQ, FERU, escenarios, modelos). Salida: `docs/analisis/calidad/` + specs Playwright.

## Prohibido en este modo

Implementar features de producto o crear artefactos de análisis nuevos (REQ/FERU/EU). Leer análisis existente como insumo sí está permitido.
