---
description: Destino local de artefactos de análisis (sin Azure DevOps)
alwaysApply: false
---
# Destino local de artefactos de análisis

Toda la documentación de requerimientos y análisis se gestiona como **archivos Markdown en el repositorio**.

## Ubicación

```
docs/analisis/
├── requerimientos/
├── feru/
├── escenarios/
├── metodos/
├── estructuras-datos/
├── modelos-datos/
├── especificaciones/
├── planes-implementacion/
└── tareas/
```

## Reglas

- **No** crear work items ni usar MCP de Azure DevOps.
- Antes de crear o modificar artefactos, mostrar vista previa y esperar confirmación del usuario.
- Usar nombres en `kebab-case.md`.
- Referencias cruzadas con rutas relativas (ej. `[Consultar usuarios](../escenarios/consultar-usuarios.md)`).
- Idioma de salida: español.
