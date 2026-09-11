---
description: Estándares INVEST, calidad y trazabilidad de requerimientos
alwaysApply: false
---
# Estándares de Calidad y Trazabilidad de Requerimientos

Reglas de calidad que todo requerimiento debe cumplir, independientemente del artefacto donde se documente. Orientado a servicios web/APIs.

## Principios de calidad (INVEST)
Cada requerimiento/historia debe ser:
- **Independiente** — evitable el acoplamiento innecesario con otros.
- **Negociable** — describe la necesidad, no una solución cerrada.
- **Valioso** — aporta valor claro al negocio o al consumidor del servicio.
- **Estimable** — con suficiente detalle para dimensionar el esfuerzo.
- **Small (acotado)** — de tamaño manejable para una iteración.
- **Testeable** — con criterios de aceptación verificables.

## Regla de oro: QUÉ y PORQUÉ, no CÓMO
Durante requerimientos, enfócate en el comportamiento observable del servicio, no en su implementación.
- Correcto: "El servicio debe rechazar la solicitud si la fecha de expiración es menor a la fecha actual."
- Evitar: "Usar un `if` que compare `fechaExpiracion` con `LocalDate.now()` en la capa de dominio."

Los detalles de implementación se reservan para las tareas de desarrollo y la especificación técnica.

## Criterios de aceptación (Given/When/Then)
Todo requerimiento debe tener al menos 2 criterios de aceptación testeables. Cubre siempre estos caminos cuando apliquen:
- **Camino feliz:** Dado un [rol] autorizado, Cuando invoca [operación] con datos válidos, Entonces el servicio retorna [resultado esperado] Y [efectos secundarios].
- **Error de validación:** Dado un [rol] autorizado, Cuando invoca [operación] con [dato inválido], Entonces el servicio responde con [código/motivo estado] Y no realiza la operación.
- **Autorización:** Dado un usuario sin [permiso], Cuando intenta [operación], Entonces el servicio responde 403 Y registra el intento.
- **Caso borde / sin datos:** Dada [condición límite o ausencia de resultados], Cuando se ejecuta [operación], Entonces ocurre [manejo controlado con su motivo estado].

## Nomenclatura e IDs (trazabilidad)
Usa prefijos sistemáticos para permitir referencias cruzadas:

| Prefijo | Uso |
|---------|-----|
| `US-X.X.X` | Historia de usuario |
| `REQ-X.X.X` | Requerimiento |
| `BR-{CAT}-XXX` | Regla de negocio |
| `SC-X` | Criterio de éxito |

## Convenciones para servicios web/APIs
- **Nombres de parámetros y campos:** camelCase en entradas/salidas (ej: `usuarioId`, `tipoEvento`).
- **Verbos de operación:** los servicios de creación se nombran con prefijo `registrar` (no `insertar`).
- **Contratos:** especifica request y response de forma completa; incluye todos los path params y query params en la URI.
- **Errores:** todo servicio debe declarar sus salidas de error (HTTP Status + Motivo Estado + Descripción).
- **Mensajes:** provienen del catálogo de Motivos Estado; los nuevos se marcan explícitamente como **(NUEVO MOTIVO ESTADO A REGISTRAR)**.
- **Trazabilidad operativa:** toda operación relevante debe registrar bitácora (request, response, usuario, tipoEvento, stackTrace ante error).

## Trazabilidad de extremo a extremo
Mantén los vínculos explícitos entre artefactos:
**Necesidad → REQ → FERU → Escenario de Uso → Método/Servicio → Tarea de desarrollo.**
Cada requerimiento debe poder rastrearse hasta la tarea que lo implementa y viceversa.

## Checklist de calidad (antes de dar por listo)
- [ ] El requerimiento describe QUÉ/PORQUÉ, no CÓMO.
- [ ] Tiene al menos 2 criterios de aceptación testeables.
- [ ] Cubre camino feliz, validación, autorización y caso sin datos (según aplique).
- [ ] Las reglas de negocio están numeradas.
- [ ] Los contratos del servicio (entradas/salidas/errores) están definidos.
- [ ] Los permisos/roles están identificados.
- [ ] Las preguntas abiertas y supuestos están registrados.
- [ ] La trazabilidad con el artefacto padre está explícita.
