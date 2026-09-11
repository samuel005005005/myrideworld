---
name: requirements-engineering-and-discovery
description: "Comando y guía estructurada para transformar las necesidades de los stakeholders en especificaciones estructuradas y testeables. Ayuda a crear documentos de requerimientos a través del descubrimiento guiado de entidades, flujos de trabajo, reglas de negocio y criterios de aceptación."
---

# Ingeniería y Descubrimiento de Requerimientos

## 1. Visión General
Transformar requerimientos brutos y necesidades de negocio en especificaciones estructuradas y testeables que guíen a los equipos de desarrollo. Este es un enfoque estructurado para descubrir, acotar prácticamente y generar un único documento consolidado de requerimientos con un lenguaje claro.

**Cuándo usarlo:**
- Creación de documentos de requerimientos de características (features).
- Escritura de historias de usuario con criterios de aceptación.
- Definición de reglas de negocio y restricciones.
- Documentación de flujos de proceso.
- Priorización de características (MoSCoW, RICE).
- Análisis de necesidades de los interesados (*stakeholders*).

---

## 2. Proceso de Descubrimiento (Las 3 Fases)

Para crear el documento, siga un proceso secuencial de 3 fases. Primero, cree una lista de tareas (TODO) para realizar el seguimiento de estas fases, marcando la primera como `"in_progress"` (en progreso) y las demás como `"pending"` (pendientes).

### Fase 1: Descubrimiento de Requerimientos
Haga preguntas enfocadas para recopilar TODOS los requerimientos (no los categorice todavía). HAGA UNA PREGUNTA A LA VEZ y espere la respuesta:
- ¿Qué capacidades específicas debe proporcionar el sistema?
- ¿Qué entidades de negocio necesita gestionar (conceptos principales, relaciones, atributos a nivel de negocio)?
- ¿Qué datos necesita almacenar y cuáles son las restricciones de negocio?
- ¿Qué reglas de negocio se deben aplicar de forma obligatoria?
- ¿Cuáles son las diferentes audiencias (personal, miembros, público, administradores)?
- ¿Cómo difieren los requerimientos entre estas audiencias?
- ¿Qué debería poder ver y hacer cada audiencia?
- ¿Cómo interactúan los usuarios con el sistema?
- ¿Qué sucede cuando no hay datos? (Estados vacíos u *empty states* para el personal frente a los miembros).
- ¿Cómo se presentan los datos? (Estilo feed, tabla, tarjetas/cards, etc.).
- ¿Qué hace que esta característica sea utilizable para todos los niveles de habilidad técnica?
- ¿Cuáles son los requerimientos de seguridad y permisos?
- ¿Qué expectativas de rendimiento existen?
- ¿Qué integraciones se necesitan con los sistemas existentes?
- ¿Qué requerimientos de cumplimiento o privacidad se aplican?

*Considere Patrones de Sistemas Existentes:* Pregunte con anticipación cuál de estas capacidades existentes podría aplicarse:
- **Búsqueda (Search):** Capacidades de búsqueda de texto completo.
- **Archivos Adjuntos (File Attachments):** Carga y gestión de documentos o archivos.
- **Pista de Auditoría (Audit Trail):** Seguimiento de cambios e historial.
- **Multi-tenancy:** Aislamiento de datos por organización o inquilino.
- **Permisos (Permissions):** Control de acceso basado en roles (RBAC).
- **Etiquetado (Tagging):** Sistemas de clasificación y categorización.
- **Campos Personalizados (Custom Fields):** Campos de datos extensibles.

### Fase 2: Enfoque Práctico y Planificación Futura
Para cada requerimiento descubierto, pregunte:
- ¿Es esto inmediatamente práctico para el alcance actual?
- ¿Debería ir en los requerimientos actuales o en `future.md` para fases posteriores?
- ¿Podemos expresar esto en un lenguaje claro y simple?
- ¿Está el alcance adaptado adecuadamente para la fase actual?
- ¿Es esto testeable y medible?

**Qué mantener en `future.md`:** Grandes ideas que van más allá del alcance actual, características complejas para la Fase 2 o 3, y funciones avanzadas que se construyen sobre la base inicial.
**Qué mantener en los requerimientos actuales:** Solo lo que sea inmediatamente práctico, esencial para la funcionalidad principal y escrito en un lenguaje claro.

### Fase 3: Generación del Documento
Genere los siguientes artefactos:
1. **requirements.md:** Un único documento consolidado (ver estructura en la siguiente sección). Aplique prefijos de ID (`US-`, `REQ-`, `SC-`) a todos los elementos.
2. **future.md:** Para requerimientos diferidos (organizados por historias de usuario y fases técnicas).
3. **discussion-summary.md:** Actualice o cree este archivo agregando una sección de "Fase de Requerimientos" con discusiones técnicas, una subsección de "Preguntas Resueltas desde la Visión", un Registro de Decisiones Clave actualizado y el Contexto Técnico con los archivos recientemente referenciados.

---

## 3. Estructura del Documento Consolidado de Requerimientos

El documento final (`requirements.md`) debe estar estructurado combinando las necesidades de negocio con las especificaciones técnicas:

1. **Historias de Usuario y Necesidades de Negocio:** Historias de usuario estructuradas por rol, flujos de trabajo de usuarios y capacidades de negocio.
2. **Capacidades Core del Sistema (Descripción General de Características):** Lo que el sistema debe proporcionar (contexto de negocio y métricas de éxito).
3. **Requerimientos de Datos de Negocio (Modelo de Datos):** Entidades, campos, tipos, relaciones y restricciones.
4. **Reglas de Negocio y Lógica:** Reglas y restricciones que gobiernan el comportamiento del sistema.
5. **Requerimientos de Experiencia de Usuario:** Cómo debe sentirse y comportarse el sistema.
6. **Atributos de Calidad y Restricciones:** Requerimientos de rendimiento, seguridad, confiabilidad, escalabilidad y controles de cumplimiento o privacidad.
7. **Puntos de Contacto de Integración:** Conexiones con sistemas existentes.
8. **Enfoque de Desarrollo y Pruebas:** Cómo se construirá y validará el sistema.
9. **Criterios de Éxito:** Criterios de aceptación claros y definición de éxito.
10. **Restricciones, Supuestos y Preguntas Abiertas:** Límites del alcance, elementos que necesitan aclaración y supuestos fundamentales.

*Nota: Incluya una tabla de contenidos con los enlaces correspondientes y una numeración sistemática de las secciones (1.1, 1.2, etc.) para una referencia cruzada precisa.*

---

## 4. Estándares y Formatos

### Formato de Identificación de Requerimientos
Todos los requerimientos deben utilizar prefijos de ID sistemáticos para facilitar las referencias cruzadas.

| Prefijo | Uso | Numeración |
|--------|-------|-----------|
| `US-X.X.X` | Historias de Usuario | Sección.Subsección.Ítem |
| `REQ-X.X.X` | Requerimientos | Sección.Subsección.Ítem |
| `SC-X` | Criterios de Éxito | Número secuencial |

*Ejemplo: `US-1.1.1` (Historia en la sección 1.1), `REQ-3.2.1` (Requerimiento en la sección 3.2), `SC-1` (Criterio de éxito 1).*

### Plantillas Core

**Formato de Historia de Usuario**
> **US-[XXX]: [Título]**
> 
> Como [rol],
> Quiero [acción],
> Para [beneficio].
> 
> **Criterios de Aceptación:**
> - [ ] Dado [contexto], cuando [action], entonces [resultado esperado]
> 
> **Prioridad**: Must Have (Obligatorio) | Should Have (Deseable) | Could Have (Podría tenerse) | Won't Have (No se tendrá por ahora)
> **Esfuerzo**: S (1-2 días) | M (3-5 días) | L (1-2 semanas) | XL (2+ semanas)
> **Dependencias**: [Listar cualquier historia dependiente]

**Patrones de Criterios de Aceptación (Given/When/Then - Dado/Cuando/Entonces)**
- **Camino Feliz (Happy Path):** Dado un [rol] autenticado, Cuando realiza [acción] con [datos de entrada] válidos, Entonces se obtiene el [resultado de éxito esperado] Y [efectos secundarios si los hay].
- **Error de Validación:** Dado un [rol] autenticado, Cuando realiza [acción] con un [tipo de dato de entrada] inválido, Entonces el sistema muestra "[mensaje de error]" Y [la operación no se completa].
- **Autorización:** Dado un usuario sin [permiso], Cuando intenta [realizar acción], Entonces el sistema devuelve 403 Prohibido (Forbidden) Y [registra el intento no autorizado].
- **Caso Borde (Edge Case):** Dada la existencia de [condición límite/borde], Cuando se realiza [acción], Entonces ocurre un [manejo controlado/control de la situación].

**Formato de Regla de Negocio**

| ID | Regla | Aplicación | Impacto |
|----|------|-------------|--------|
| BR-{CAT}-001 | [Descripción de la regla] | [Crear/Actualizar/Eliminar] | [Rechazar con error] |

**Plantilla de Modelo de Datos**

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|----------|-------------|-------------|
| Id | Guid | Sí | PK | Identificador único |
| Email | string | Sí | Email válido, Único | Email de contacto |

**Plantilla de Flujo de Proceso**
Defina los *Actores* (Actor, Role, Responsabilidad), los pasos del *Flujo* (validaciones del sistema, pasos de éxito y manejo de errores) y las *Reglas de Negocio Aplicadas* en cada paso.

---

## 5. Métodos de Priorización

### Método MoSCoW
- **Must Have (Obligatorio):** Crítico para el lanzamiento (~60% del esfuerzo).
- **Should Have (Debería tenerse):** Importante pero no crítico (~20% del esfuerzo).
- **Could Have (Podría tenerse):** Deseable o "agradable de tener" (~20% del esfuerzo).
- **Won't Have (No se tendrá):** Fuera del alcance para este lanzamiento (se documenta para el futuro).

### Puntuación RICE (RICE Scoring)
`Puntuación RICE = (Alcance × Impacto × Confianza) / Esfuerzo`
- **Alcance (Reach):** Cuántos usuarios se verán afectados por trimestre.
- **Impacto (Impact):** Efecto en cada usuario (3 = masivo, 2 = alto, 1 = medio, 0.5 = bajo, 0.25 = mínimo).
- **Confianza (Confidence):** Qué tan seguros estamos (100% = alta, 80% = media, 50% = baja).
- **Esfuerzo (Effort):** Personas-mes requeridas para completarlo.

---

## 6. Lista de Verificación de Calidad

Antes de finalizar los requerimientos, asegúrese de que:
- [ ] Se hayan definido al menos 3 historias de usuario.
- [ ] Cada historia tenga 2 o más criterios de aceptación testeables (Dado/Cuando/Entonces).
- [ ] El modelo de datos incluya todos los campos con sus respectivos tipos.
- [ ] Las reglas de negocio estén numeradas y documentadas.
- [ ] Los permisos estén alineados con los roles existentes.
- [ ] Se hayan capturado las preguntas abiertas.
- [ ] Se haya asignado la prioridad a cada historia y se hayan identificado las dependencias.

---

## 7. Directrices y Reglas del Proceso

- **Mantenerse a Nivel de Requerimientos:** Enfóquese en el QUÉ y el PORQUÉ, no en el CÓMO. Correcto: "El sistema debe registrar si el evento es un borrador o está publicado". Evitar: "Usar un flag booleano para el campo is_draft". Guarde los detalles de implementación técnica para la fase de especificación.
- **Integración con el Modelado de Dominio:** Revise el dominio existente antes de escribir los requerimientos. Identifique nuevas entidades durante el análisis y, después de los requerimientos, cree un análisis de impacto utilizando la habilidad de `domain-modeling`.
- **Esperar Iteración:** Los requerimientos a menudo se refinan a medida que los usuarios analizan detalladamente las implicaciones. Cuando los requerimientos cambien, actualice TODAS las secciones relacionadas de manera consistente.
- **Claridad:** Mantenga un lenguaje claro y conversacional, evite el lenguaje corporativo excesivo o rebuscado. Enfóquese en requerimientos inmediatamente útiles y evite la sobreingeniería.
- **Justificación de Decisiones:** Al documentar decisiones arquitectónicas clave (por ejemplo, página separada vs. modal), capture la justificación (rendimiento, experiencia de usuario UX, capacidad de enlace, etc.).

---

## 8. Proceso de Inicio

Para comenzar la ejecución con la IA o el equipo:
1. Cree la lista de tareas (TODO) de 3 fases inmediatamente.
2. Pregunte: "¿En qué directorio de características (features) está trabajando? (ej. project/features/FT033-nombre-caracteristica)"
3. Pregunte: "Por favor, etiquete su documento de visión con @vision.md para que pueda entender el alcance de la característica"
4. Valide el directorio y confirme dónde se creará el documento.
5. Revise el documento de visión (o la guía local en `@project/guides/feature-development-process.md`).
6. Comience la Fase 1 con la primera pregunta de descubrimiento de requerimientos.
7. Mantenga las preguntas enfocadas y espere las respuestas antes de continuar.

## Referencias

- [references/user-story-examples.md](references/user-story-examples.md) - Ejemplos del mundo real
- [references/acceptance-criteria-patterns.md](references/acceptance-criteria-patterns.md) - Patrones comunes
- [references/acceptance-criteria-patterns.md](references/acceptance-criteria-patterns.md) - Patrones comunes
- [references/especificacion-suplementaria.html](references/especificacion-suplementaria.html) - Patrón de estructura de una especificación suplementaria para campos de presentación en una consulta
- [references/"Escenario-de-Caso-de-Uso.docx"](references/"Escenario-de-Caso-de-Uso.docx") - Patrón de estructura de Escenario de caso de uso
- [references/"Escenario-de-uso.html"](references/"Escenario-de-uso.html") - Patrón de estructura de Escenario de caso de uso 
- [references/"Estructura-de-datos.html"](references/"Estructura-de-datos.html") - Patrón de estructura de Estructura de datos
- [references/"Metodo-Servicio.html"](references/"Metodo-Servicio.html") - Patrón de estructura de Metodo o Servicio
- [references/"Modelo-de-datos.html"](references/"Modelo-de-datos.html") - Patrón de estructura de Modelo de datos

---

## 9. Persistencia local de artefactos

Tras el descubrimiento (Fases 1-3), materializar en el repo:

1. Requerimiento en `docs/analisis/requerimientos/<nombre>.md` (+ tareas en `docs/analisis/tareas/`).
2. FERU en `docs/analisis/feru/<nombre>.md` (interpretación, contribuciones, impacto).
3. Artefactos técnicos vía skill `analisis-documentacion-escenarios` (escenarios, métodos, estructuras, modelos, especificaciones).
4. Opcional: prompt de desarrollo en `docs/analisis/tareas/` con el detalle para implementar.

Seguir el checklist de `.agents/rules/analisis-flujo-completo-post-levantamiento.md`.
Vista previa y confirmación antes de escribir archivos.
