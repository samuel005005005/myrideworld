---
name: qa-generar-codigo-playwright
description: Genera automatización Playwright (page object, data, spec) desde planes/casos locales o escenarios en docs/analisis. Use when the user asks for Playwright tests, QA automation, or evidence specs.
---
# Generar código Playwright (local)

## Entrada

1. Plan/casos en `docs/analisis/calidad/` **o** escenarios en `docs/analisis/escenarios/`
2. Módulo/pantalla (pasajero, conductor, admin, API)
3. Carpeta destino del proyecto Playwright (preguntar si no existe)

## Procedimiento

1. Leer EU / plan → steps y resultados esperados.
2. Leer métodos/modelos si existen → mocks y datos.
3. Revisar UI real en `mobile-*` / `web-admin` solo si faltan labels/rutas.
4. Generar:
   - `tests/pages/{modulo}.page.ts` — locators por rol/label/texto (no CSS/XPath frágil)
   - `tests/data/{modulo}.data.ts` — datos tipados Positiva/Negativa
   - `tests/{modulo}.spec.ts` — data-driven; español en títulos
5. Mocks con `page.route` según contratos del análisis.
6. Auth: `storageState` si la pantalla lo requiere.

## No hacer

- Crear work items en Azure.
- Subir evidencia a ADO.
- Mezclar varios page objects en un solo archivo sin necesidad.
