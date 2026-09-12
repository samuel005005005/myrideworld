---
description: Checkpoint de cola de prompts (#retoma / #guarda-cola)
alwaysApply: true
---
# Cola de prompts

Archivo canónico: `.agents/docs/cola-prompts.md`

| Usuario escribe | Tú haces |
|-----------------|----------|
| `#retoma` | Lee la cola y continúa solo lo pendiente |
| `#guarda-cola` | Actualiza checkpoint; no continúes la tarea |

Checkpoint también si el trabajo queda a medias al devolver el turno. No en cada mensaje.

```bash
python scripts/cola_prompts.py status
python scripts/cola_prompts.py resume
```

Formato del archivo: corto — modo, 3–6 bullets hecho, 1 línea falta, prompt de reanudación. Sin transcripts ni código.
