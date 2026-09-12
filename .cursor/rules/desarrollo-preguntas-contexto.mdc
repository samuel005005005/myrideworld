---
description: Qué preguntar antes de generar código
alwaysApply: false
---
# Preguntas de Contexto

## Propósito

Reglas para que el agente pregunte activamente cuando detecte que falta información crítica antes de generar código. Evita adivinanzas y reduce iteraciones fallidas.

---

## Regla Principal

**Si falta información para tomar una decisión de diseño o implementación, PREGUNTAR antes de generar.** No inventar datos, URLs, nombres de módulos, ni stack tecnológico.

---

## Preguntas por Tipo de Tarea

### Al Iniciar Cualquier Tarea

| # | Pregunta | Por qué es necesaria |
|---|----------|---------------------|
| 1 | ¿Hay doc de análisis relacionado en `docs/analisis/`? | Contexto de la tarea |
| 2 | ¿Existe código relacionado en el proyecto? | Para no duplicar ni romper patrones existentes |

### Al Crear Features / CRUD / Caso de Uso

| # | Pregunta | Por qué es necesaria |
|---|----------|---------------------|
| 3 | ¿Cuáles son las reglas de negocio? | Las entidades necesitan comportamiento, no solo campos |
| 4 | ¿Qué validaciones tiene cada campo? (longitud, formato, obligatoriedad) | Para crear DTOs y validaciones correctas |
| 5 | ¿Qué errores de negocio pueden ocurrir? | Para crear excepciones tipadas y tests |
| 6 | ¿Es un Command (mutación) o Query (lectura)? | Para aplicar CQRS donde corresponda |
| 7 | ¿Hay integraciones externas involucradas? | Para crear interfaces/adapters correctos |
| 8 | ¿Cuáles son los acceptance criteria? | Para generar unit tests que validen las reglas |

### Al Corregir Bugs

| # | Pregunta | Por qué es necesaria |
|---|----------|---------------------|
| 9 | ¿Cuál es el comportamiento esperado vs actual? | Sin esto, adivino qué está mal |
| 10 | ¿En qué ambiente se reproduce? | Puede ser un tema de config, no de código |
| 11 | ¿Hay pasos para reproducir? | Para ubicar el flujo afectado |

### Para Infraestructura (CDK / K8s / Pipelines)

| # | Pregunta | Por qué es necesaria |
|---|----------|---------------------|
| 12 | ¿Cuál es la arquitectura de despliegue? (ECS Fargate / EKS / Lambda) | Define el tipo de stack CDK a generar |
| 13 | ¿Qué servicios AWS se necesitan? (RDS, S3, SNS, SQS, DynamoDB, etc.) | Para crear los recursos correctos en CDK |
| 14 | ¿Hay VPC/subnets ya creados por Infra? | CDK solo crea Security Groups, NO networking |
| 15 | ¿Qué credenciales/secrets necesita la app? | Se crean como Parameter Store SecureString con valor placeholder |
| 16 | ¿Cómo se despliega? (pipeline CI, manual, GitOps) | Para generar pipeline o documentar proceso |
| 17 | ¿A qué ambientes va? (DEV / CERT / PROD) | Recursos y replicas cambian por ambiente |

### Para Refactorización

| # | Pregunta | Por qué es necesaria |
|---|----------|---------------------|
| 18 | ¿Qué NO debe cambiar? (contratos, comportamiento externo) | Para no romper integraciones |
| 19 | ¿Hay tests existentes que validen el comportamiento actual? | Para saber si puedo refactorizar con red de seguridad |

---

## Cuándo NO Preguntar

No preguntar si la respuesta se puede obtener de:

- El código existente en el repositorio (leer antes de preguntar)
- Los steering files (convenciones ya definidas)
- El `03-contexto-proyecto.md` (si está lleno)
- Los artefactos en `docs/analisis/`
- Archivos de configuración del proyecto (package.json, pyproject.toml, etc.)

---

## Reglas para el Agente

1. **Lee el código y contexto primero**. Solo pregunta lo que no puedes inferir.
2. **Agrupa preguntas**. No preguntes una por una; junta las que falten en un solo mensaje.
3. **Ofrece opciones cuando sea posible**. En vez de "¿cuál es el framework?", pregunta "¿Es FastAPI, NestJS, o .NET?" si puedes inferir las opciones.
4. **Si el usuario dice "igual que X"**, buscar X en el proyecto y replicar el patrón sin más preguntas.
6. **Para bugs, lo mínimo es**: comportamiento esperado + comportamiento actual. Si no lo dan, pedirlo antes de investigar.
7. **Para infra, siempre confirmar ambiente** antes de generar recursos (un error en prod es irreversible).
8. **No preguntar por convenciones de código** — esas ya están definidas en los steering.
