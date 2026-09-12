#!/usr/bin/env python3
"""CLI para la cola de prompts (checkpoint).

Uso:
  python scripts/cola_prompts.py status
  python scripts/cola_prompts.py resume
  python scripts/cola_prompts.py session-hook   # JSON de contexto para hook de sesión
  python scripts/cola_prompts.py has-active     # exit 0 si hay ítem en curso
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLA = ROOT / ".agents" / "docs" / "cola-prompts.md"


def _read() -> str:
    if not COLA.exists():
        return ""
    return COLA.read_text(encoding="utf-8")


def _section(text: str, heading: str) -> str:
    """Extrae markdown bajo ## heading hasta el siguiente ##."""
    pattern = rf"(?ms)^## {re.escape(heading)}\s*\n(.*?)(?=^## |\Z)"
    m = re.search(pattern, text)
    return (m.group(1).strip() if m else "").strip()


def has_active(text: str | None = None) -> bool:
    body = _section(text or _read(), "En curso")
    if not body:
        return False
    low = body.lower()
    if "sin ítem activo" in low or "sin item activo" in low:
        return False
    # Placeholder vacío / solo comentarios
    lines = [
        ln.strip()
        for ln in body.splitlines()
        if ln.strip() and not ln.strip().startswith("<!--")
    ]
    return len(lines) > 0


def status_text() -> str:
    text = _read()
    if not text:
        return "Cola: archivo inexistente (.agents/docs/cola-prompts.md)."
    curso = _section(text, "En curso") or "_vacío_"
    if not has_active(text):
        return "Cola: sin ítem en curso. Usa #guarda-cola tras avance, o #retoma cuando haya checkpoint."
    return (
        "Cola — En curso:\n"
        f"{curso}\n\n"
        "Para continuar en el agente: escribe #retoma\n"
        f"Archivo: {COLA.relative_to(ROOT)}"
    )


def resume_block() -> str:
    text = _read()
    if not has_active(text):
        return (
            "#retoma\n"
            "# No hay ítem en curso en .agents/docs/cola-prompts.md\n"
            "# Guarda un checkpoint con #guarda-cola antes de retomar."
        )
    return (
        "#retoma\n"
        "Continúa solo lo pendiente según .agents/docs/cola-prompts.md.\n"
        "No recrees lo ya hecho.\n"
        "Contexto: lee ese archivo ahora."
    )


def session_hook_payload() -> dict:
    """Salida JSON para hook de inicio de sesión (additional_context opcional)."""
    text = _read()
    if not has_active(text):
        return {}
    curso = _section(text, "En curso")
    ctx = (
        "Checkpoint de cola de prompts activo (.agents/docs/cola-prompts.md).\n"
        "Si el usuario escribe #retoma, lee ese archivo y continúa solo lo pendiente.\n"
        "Si escribe #guarda-cola, actualiza el checkpoint sin retomar.\n\n"
        f"En curso:\n{curso}"
    )
    return {"additional_context": ctx}


def main(argv: list[str]) -> int:
    cmd = (argv[1] if len(argv) > 1 else "status").strip().lower()
    if cmd in {"-h", "--help", "help"}:
        print(__doc__.strip())
        return 0
    if cmd == "status":
        print(status_text())
        return 0
    if cmd == "resume":
        print(resume_block())
        return 0
    if cmd == "has-active":
        return 0 if has_active() else 1
    if cmd == "session-hook":
        # Formato JSON en stdout; {} = sin inyección
        print(json.dumps(session_hook_payload(), ensure_ascii=False))
        return 0
    print(f"Comando desconocido: {cmd}", file=sys.stderr)
    print(__doc__.strip(), file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
