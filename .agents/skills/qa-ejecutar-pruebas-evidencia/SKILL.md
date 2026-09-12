---
name: qa-ejecutar-pruebas-evidencia
description: Ejecuta Playwright con screenshots por paso y guarda results.json local. Use when running QA evidence tests without Azure DevOps upload.
---
# Ejecutar pruebas con evidencia (local)

## Trigger

Ejecutar plan/spec, correr tests con evidencia, documentar resultados.

## Flujo

1. Ubicar spec Playwright del módulo.
2. Ejecutar (ej. `npx playwright test tests/{modulo}.spec.ts`).
3. Guardar evidencia en `evidence/{modulo}/` o `docs/analisis/calidad/evidencia/{modulo}/`:
   - `results.json` (TC → steps → status → screenshot path)
   - PNGs por paso
4. Resumir pass/fail al usuario.
5. **No** subir a Azure DevOps.

## results.json (mínimo)

```json
[
  {
    "id": "TC-001",
    "title": "CP - ...",
    "status": "passed",
    "steps": [
      { "step": 1, "description": "...", "status": "passed", "screenshot": "TC-001/step-01.png" }
    ]
  }
]
```
