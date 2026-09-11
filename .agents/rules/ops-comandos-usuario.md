---
description: No ejecutar comandos de deploy/ops por el agente; darlos al usuario
alwaysApply: true
---

# Comandos: el usuario los ejecuta

Para ahorrar tokens / cuota Cursor:

1. **No** corras vos (Shell/SSH/rsync/gcloud/docker remoto) comandos de:
   - deploy a VM / Google Cloud
   - rsync / scp a servidores
   - rebuild / restart de contenedores en prod
   - smoke remoto (`curl` a IPs públicas) salvo que el usuario pida explícitamente “hacelo vos”
2. **Sí** entregá los comandos listos para copiar/pegar, en el orden correcto, con cwd claro.
3. Lectura/edición de código **local** del repo sigue permitida con herramientas normales.
4. Tests / builds **locales** solo si el usuario lo pide o son necesarios para validar un cambio de código que él pidió.

## Ejemplo

```text
❌ BAD: ssh … docker-compose up; rsync … a la VM
✅ GOOD: pegar el bloque rsync + ssh + curl para que el usuario lo corra
```
