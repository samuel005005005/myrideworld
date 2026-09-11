---
description: Definition of Ready y derivación de insumos para desarrollo
alwaysApply: false
---
# Definition of Ready y Derivación de Insumos para Desarrollo

Define cuándo un requerimiento está lo suficientemente maduro para convertirse en tareas de desarrollo, y cómo derivar esos insumos. Es el puente entre el levantamiento de requerimientos y el trabajo de los desarrolladores.

## Definition of Ready (DoR)
Un requerimiento NO se convierte en tareas de desarrollo hasta cumplir todo lo siguiente:

- [ ] El objetivo de negocio y el alcance están claros y acotados.
- [ ] Tiene criterios de aceptación testeables (Given/When/Then).
- [ ] Los actores, roles y permisos están identificados.
- [ ] Las reglas de negocio y validaciones están documentadas y numeradas.
- [ ] Para cada servicio: entradas (path/query/body), salidas exitosas y salidas de error están definidas.
- [ ] Las dependencias e integraciones con otros servicios/sistemas están identificadas.
- [ ] Los datos/entidades afectadas y sus restricciones están descritos.
- [ ] Los supuestos y preguntas abiertas están registrados (idealmente resueltos).
- [ ] La trazabilidad con el artefacto padre (REQ/FERU/Escenario) está establecida.

Si algún punto crítico falta, vuelve a la elicitación antes de generar tareas.

## Cuándo generar tareas de desarrollo
Genera tareas cuando el requerimiento cumple el DoR y requiere construcción/modificación de software. No todo requerimiento amerita tareas de desarrollo (ej: cambios puramente documentales o de configuración).

## Cómo derivar las tareas (insumos)
Las tareas se crean como archivos Markdown en `docs/analisis/tareas/` referenciando el requerimiento. Al derivarlas:

- **Una tarea = una unidad accionable y estimable** de trabajo para el desarrollador.
- Deriva las tareas desde los **escenarios de uso y métodos/servicios**, no desde el requerimiento en abstracto.
- Cada tarea debe indicar claramente **qué** se construye y contra qué **criterio de aceptación** se valida.
- Separa por naturaleza: implementación de servicio, pruebas unitarias, cambios de datos, integración.
- Mantén el enfoque en servicios: una tarea típica cubre un endpoint/método con su contrato, validaciones y bitácora.

## Documento/prompt de desarrollo (solo si amerita)
Cuando la complejidad lo justifique, además de las tareas, genera un documento `.md` con un **prompt detallado de desarrollo** que incluya:

- Contexto del feature y objetivo del servicio.
- Contratos de los endpoints/métodos (request, response, errores).
- Reglas de negocio y validaciones a implementar.
- Modelo y estructura de datos involucrados.
- Requisitos de bitácora y trazabilidad.
- Criterios de aceptación como definición de "hecho".
- Stack tecnológico y convenciones aplicables.

Este documento solo se genera **bajo solicitud o cuando la tarea sea compleja**; para cambios simples, las tareas en `docs/analisis/tareas/` son suficiente insumo.

## Definition of Done (referencia para el insumo)
Al redactar las tareas, deja claro qué las da por terminadas: código implementado, pruebas unitarias, validaciones y bitácora cubiertas, y criterios de aceptación verificados por SQA.
