---
description: Reglas de elicitación y descubrimiento de requerimientos
alwaysApply: false
---
# Elicitación de Requerimientos: Sugerencias, Reglas y Estándares

Reglas y buenas prácticas para conducir la elicitación (descubrimiento) de requerimientos orientados a servicios web/APIs. Aplica siempre que se esté levantando o entendiendo una necesidad.

## Reglas de conducción
- **Una pregunta a la vez.** Haz preguntas enfocadas y espera la respuesta antes de continuar. No abrumes con cuestionarios largos.
- **Del negocio a lo técnico.** Empieza por el objetivo de negocio y el problema real; solo después baja a datos, reglas y contratos de servicio.
- **Escucha activa.** Parafrasea lo entendido para confirmar ("Entiendo que necesitas... ¿es correcto?") antes de documentar.
- **No asumas.** Si un dato es ambiguo o falta, pregúntalo. Marca explícitamente los supuestos que no puedas confirmar.
- **Reutiliza contexto.** Si algo ya se respondió en la conversación, no lo vuelvas a preguntar.

## Preguntas guía (adaptar al caso)
### Entendimiento del problema
- ¿Qué problema o dolor concreto se quiere resolver? ¿Por qué ahora?
- ¿Cómo se hace hoy (solución actual) y cuáles son sus limitaciones?
- ¿Qué se espera lograr (solución esperada) y cómo se medirá el éxito?

### Actores y alcance
- ¿Qué entidades, roles o sistemas consumen el servicio?
- ¿Qué debe poder hacer cada actor? ¿Qué permisos/roles aplican?
- ¿Qué queda dentro y qué queda fuera del alcance de esta fase?

### Orientado a servicios web/APIs
- ¿Qué operaciones expone el servicio (consultar, registrar, actualizar, anular)?
- ¿Cuáles son las entradas (path params, query params, body) y las salidas esperadas?
- ¿Qué validaciones de negocio y de integridad deben aplicarse?
- ¿Qué reglas de seguridad/autorización rigen el consumo?
- ¿Qué debe pasar ante error o ausencia de datos? (motivos estado, códigos de respuesta)
- ¿Existen integraciones o dependencias con otros servicios/sistemas?
- ¿Hay expectativas de rendimiento, volumen o concurrencia?

### Datos y reglas
- ¿Qué entidades de negocio se gestionan y cuáles son sus atributos clave?
- ¿Qué reglas de negocio son obligatorias? ¿Qué restricciones de datos existen?
- ¿Se requiere trazabilidad/bitácora de las operaciones?

## Técnicas recomendadas
- **Entrevistas dirigidas** con preguntas abiertas para descubrir, cerradas para confirmar.
- **Análisis del estado actual vs. esperado** (gap analysis) como marco base.
- **Prototipado conversacional:** describe el flujo del servicio paso a paso y valida con el stakeholder.
- **5 porqués** para llegar a la causa raíz de una necesidad, no solo al síntoma.
- **Priorización explícita** (MoSCoW o RICE) cuando haya más peticiones que capacidad.

## Manejo de stakeholders
- Identifica quién es el **dueño del proceso** (negocio) y el **dueño del producto** (técnico/servicio).
- Distingue entre lo que el usuario **pide** (solución que imagina) y lo que **necesita** (problema real).
- Ante conflictos entre stakeholders, documenta ambas posturas y escala la decisión; no la resuelvas por tu cuenta.
- Registra las **preguntas abiertas** que queden pendientes de respuesta.

## Diferir a fases futuras
Todo lo que no sea inmediatamente práctico para el alcance actual se documenta como trabajo futuro, no se descarta. Mantén el alcance actual acotado a lo esencial y testeable.
