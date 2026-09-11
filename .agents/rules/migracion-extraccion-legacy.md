---
description: Extracción de análisis desde legacy TripTap (sin traer código; usado|dudoso|muerto)
alwaysApply: true
---
# Extracción de análisis (TripTap World)

## Enfoque

Este repo es **solo documentación**. Ver `docs/analisis/sistema/enfoque-trabajo.md`.

- **No** copiar ni portar código legacy aquí.
- **No** strangler / proxy / convivir runtimes.
- **Sí** leer legacy en rutas hermanas para documentar comportamiento.
- El sistema nuevo se desarrolla **después** del análisis y se despliega **en paralelo** al viejo.

## Cuándo aplica

Al leer repos legacy (lista en `contexto-proyecto.md`) o ampliar `docs/analisis/`.

## Reglas

1. **Fuente de comportamiento vivo (solo para análisis):** repos legacy listados en `contexto-proyecto.md`. Ignorar `dist/` y scaffolds vacíos.
2. Toda regla lleva etiqueta **`usado` | `dudoso` | `muerto`**. La evidencia (path legacy) es **traza del análisis**, no instrucción de implementación greenfield.
3. Documentar primero el **comportamiento de producto** (qué debe hacer el sistema nuevo). Paths legacy opcionales / secundarios.
4. Lo `muerto` se documenta como tal y **no** se implementa en el sistema nuevo.
5. Preguntar al usuario **solo** lo `dudoso` que bloquee comportamiento.
6. Heurística `muerto`: mounts comentados, cero uso en clientes, builds huérfanos, deps sin imports.
7. Heurística `dudoso`: dual paths, naming contradictorio, features sin uso claro, auth laxo.
8. Persistir en `docs/analisis/` (no solo en el chat).
9. Completar **análisis por dominio** antes de proponer implementación.
10. El desarrollo es **desde cero**; los docs son el contrato de comportamiento, no un mapa para copiar código.
