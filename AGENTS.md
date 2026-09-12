# MyRide — guía para el agente (Cursor)

Este repo es **MyRide**: plataforma de transporte turístico (pasajero, conductor, admin, API).

## Dónde está lo que debo seguir

| Qué | Copia activa (Cursor) | Origen (no borrar) |
|-----|------------------------|--------------------|
| Reglas | `.cursor/rules/*.mdc` | `.agents/rules/*.md` |
| Skills | `.cursor/skills/*/SKILL.md` | `.agents/skills/` |
| Hook pre-commit | `.cursor/hooks/precommit-gate.sh` | `.agents/hooks/` |
| Cola de prompts | `.agents/docs/cola-prompts.md` | — |

`.agents/` se conserva. Fuente operativa: `.cursor/`.

## Siempre aplicar

- `.cursor/rules/contexto-proyecto.mdc`
- `.cursor/rules/seleccion-modo.mdc`
- `.cursor/rules/ops-comandos-usuario.mdc`
- `.cursor/rules/sesion-y-tokens.mdc`
- `.cursor/rules/cola-prompts.mdc` — `#retoma` / `#guarda-cola`
- `.cursor/rules/desarrollo-clean-architecture-pureza.mdc` — dominio/aplicación sin libs; cero tarifas hardcodeadas

## Modos

- **Desarrollo** → `modo-desarrollo` + conventions
- **Análisis** → `modo-analisis` + skills `analisis-*`
- **Calidad** → `modo-calidad` + skills `qa-*`

## Skills

`dev-*` · `analisis-*` · `qa-generar-codigo-playwright` · `qa-ejecutar-pruebas-evidencia` · `qa-validar-aprobacion`

## Código

Español. Clean Architecture + vertical slices. Una clase/interfaz pública por archivo. Artefactos en `docs/analisis/`.
