---
name: qa-validar-aprobacion
description: Checklist local de cierre QA (cobertura de EU/AC, evidencia, pendientes) sin Azure DevOps. Use when closing a QA cycle or asking if tests are ready for sign-off.
---
# Validar cierre QA (local)

## Entrada

Ruta del plan en `docs/analisis/calidad/planes/` y carpeta de evidencia (si hubo ejecución).

## Checklist

- [ ] Cada EU/US del alcance tiene al menos un CP Positiva
- [ ] Flujos alternos/errores acordados tienen CP Negativa
- [ ] Pasos con acción + resultado esperado
- [ ] Evidencia presente para CP ejecutados (`results.json` + screenshots)
- [ ] Fallidos listados con causa y follow-up
- [ ] Confirmación del usuario (aprobador) registrada en el plan o en la cola

## Salida

Informe corto: ✅ listo / ❌ pendientes (lista). No usar comentarios de Azure DevOps.
