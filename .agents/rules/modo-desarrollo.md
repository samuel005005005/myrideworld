---
description: Activa modo Desarrollo: código, arquitectura, testing, commits, seguridad
alwaysApply: false
---
# Modo Desarrollo

Activa las reglas y convenciones para tareas de desarrollo de software: código, arquitectura, testing, commits, seguridad, logging y rendimiento.

Cuando el usuario elija **modo Desarrollo**, lee y aplica estas rules del proyecto:

- `.agents/rules/desarrollo-convenciones-desarrollo.md`
- `.agents/rules/desarrollo-conventional-commits.md`
- `.agents/rules/desarrollo-banco-prompts.md`
- `.agents/rules/desarrollo-estructura-por-lenguaje.md`
- `.agents/rules/desarrollo-patrones-diseno.md`
- `.agents/rules/desarrollo-seguridad.md`
- `.agents/rules/desarrollo-logging.md`
- `.agents/rules/desarrollo-rendimiento-complejidad.md`
- `.agents/rules/desarrollo-infraestructura-aws.md`
- `.agents/rules/desarrollo-controles-calidad.md`
- `.agents/rules/desarrollo-preguntas-contexto.md`
- `.agents/rules/desarrollo-flujo-trabajo.md`
- `.agents/rules/migracion-extraccion-legacy.md` / `docs/analisis/sistema/enfoque-trabajo.md`

Solo implementar cuando el dominio esté analizado. Este repo no recibe código legacy; el sistema nuevo va aparte y en paralelo al viejo.

Antes de implementar, lee escenarios/métodos/RN en `docs/analisis/`.

También aplica las conventions por lenguaje en `.agents/rules/convention-*.md` según los archivos que se editen.

Regla transversal: `.agents/rules/desarrollo-una-clase-por-archivo.md` (**una clase/interfaz por archivo**).

En **TypeScript** (`apiRest`, `appAdmin`, etc.) aplica de forma estricta `convention-typescript.md`: **prohibido `Record<>`**, **una clase/interfaz exportada por archivo** (sin DTOs inline en controllers).

En **Dart** (`appdriver`) y **Kotlin** (`apptable`, `appPayment`): **una clase/interfaz pública por archivo** (ver `convention-dart.md` / `convention-kotlin.md`).
