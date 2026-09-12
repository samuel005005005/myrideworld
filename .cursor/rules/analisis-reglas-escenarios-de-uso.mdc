---
description: Reglas de formato para escenarios de uso (Markdown local)
alwaysApply: false
---
# Reglas de Formato para Escenarios de Uso

## Propósito

Formato obligatorio de Escenarios de Uso en `docs/analisis/escenarios/`. Estilo de **interacción** (sistema ↔ usuario), sin secciones temáticas ni tablas de bitácora.

---

## Regla principal: flujo de interacción

### Prohibido — secciones temáticas como ítems

No numerar como criterios cosas como: "Validaciones generales", "Reglas de integridad", "Consulta principal", "Mensajería", "Bitácora".

### Correcto — integrar en el flujo

Validaciones y reglas van **dentro** del criterio de validación del sistema o en el **Detalle de Flujo**.

---

## NO incluir tabla de Bitácora en el escenario

Referenciar la Especificación Suplementaria / artefacto de bitácora con enlace relativo. Detalle de campos vive en suplementaria o en el Método.

---

## Detalle de Flujo = narrativa

1. El usuario hace algo.
2. El sistema valida / presenta / consume / retorna.
3. `[Flujo alterno: condición]` …
4. El sistema registra bitácora (referencia).

Un solo flujo continuo. No separar "funcional" vs "técnico".

---

## Estructura del archivo

```markdown
# EU: {título}

## Objetivo
1 párrafo.

## Criterios de Aceptación
1. Interfaz/UI (si aplica).
2. El sistema valida: rol, estado, vigencias, fallos → motivo; validaciones específicas.
3. Datos cumplen Reglas de Integridad (link).
4. El sistema consume el método X (link) y muestra/retorna…
5. Sin datos: mensaje/motivo.
6. Mensajes de incidencias.
7. Bitácora según suplementaria (link).

## Detalle de Flujo
Pasos narrativos usuario/sistema (+ alternos).

## Métodos Asociados
- links a `docs/analisis/metodos/` si existen
```

---

## Reglas para el agente

1. Nunca secciones temáticas como criterios.
2. Nunca tabla de bitácora en el escenario.
3. Detalle de Flujo narrativo.
4. Al corregir escenarios viejos, reestructurar a este formato.
5. Destino: `docs/analisis/escenarios/eu-*.md` (kebab-case).
