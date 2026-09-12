---
description: Flujo QA completo local: plan + Playwright + evidencia
alwaysApply: false
---
# Flujo QA End-to-End (local)

## Trigger

- "QA completo de {feature}"
- "Documentar y ejecutar pruebas de {EU/REQ}"

## Fases

1. **Plan** — seguir `calidad-flujo-plan-pruebas` → Markdown en `docs/analisis/calidad/planes/`.
2. **Playwright** — skill `qa-generar-codigo-playwright` (page object + data + spec) en el proyecto de tests acordado (o carpeta nueva si el usuario lo indica).
3. **Ejecutar** — skill `qa-ejecutar-pruebas-evidencia` (screenshots + `results.json` locales).
4. **Cierre** — skill `qa-validar-aprobacion` (checklist local) + actualizar cola si aplica.

## Prohibido

Subir evidencia a Azure DevOps. Implementar features de producto (eso es modo desarrollo).
