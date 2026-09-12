---
name: dev-aws-services
description: Patrones AWS de la empresa: Parameter Store vs Secrets Manager, S3, SNS, Lambda, CDK y acceso cross-account. Use when connecting to AWS, choosing secrets storage, creating CDK infra, or mentioning bucket/cola/notificación/secreto.
---

# AWS Services - Patrones la empresa

## Purpose

Conocimiento sobre cómo la empresa utiliza los servicios de AWS. Define qué servicio usar para cada necesidad, cómo se organiza la configuración por ambiente, y los patrones de seguridad establecidos.

## Use this skill when

- El usuario necesita conectar con un servicio AWS.
- Se necesita decidir entre Secrets Manager vs Parameter Store.
- Se crea infraestructura nueva (CDK).
- Se necesita acceso cross-account.
- Se menciona "secreto", "parámetro", "bucket", "notificación", "cola", "lambda".

## Instructions

### 1. Servicios AWS que usa la empresa

| Servicio | Propósito en la empresa |
|----------|---------------------|
| **Secrets Manager** | Credenciales de BD, tokens de APIs externas, connection strings |
| **Parameter Store (SSM)** | API keys internas, configuración por ambiente, feature flags |
| **Cognito** | Autenticación de usuarios (login, registro, reset password, JWT) |
| **S3** | Almacenamiento de documentos, archivos generados, XMLs firmados |
| **SNS** | Disparar procesos batch, notificaciones entre servicios |
| **SQS** | Colas de mensajes para procesamiento asíncrono |
| **Lambda** | Funciones aisladas (ej: firmar XML, transformar documentos) |
| **DynamoDB** | Datos NoSQL, acceso cross-account via STS |
| **STS** | Asumir roles para acceso entre cuentas AWS |
| **Elastic Beanstalk** | Deploy de APIs (actual, migrando a ECS/EKS) |
| **CloudWatch** | Logs y métricas de aplicación |
| **EventBridge** | Reglas programadas que disparan procesos via SNS |

### 2. Cuándo usar Secrets Manager vs Parameter Store

| Dato | Dónde | Por qué |
|------|-------|---------|
| Connection strings de BD | Secrets Manager | Sensible, rotación automática |
| Credenciales de APIs externas | Secrets Manager | Sensible |
| Tokens de servicios | Secrets Manager | Sensible, expiran |
| API keys internas (entre servicios propios) | Parameter Store | Config, no sensible |
| URLs de servicios por ambiente | Parameter Store | Config |
| Feature flags | Parameter Store | Cambia sin redeploy |
| ARNs de recursos | Parameter Store o constantes | Referencia |

### 3. Configuración por Ambiente

En la empresa toda la configuración está indexada por ambiente. Cada ambiente tiene sus propios recursos AWS:

| Ambiente | Uso | Naming pattern |
|----------|-----|----------------|
| **DEV** | Desarrollo local y pruebas iniciales | `dev/servicio/nombre` |
| **CERT** | Certificación interna (QA) | `cert/servicio/nombre` |
| **CERT_servicio externo** | Certificación con servicio externo (entidad externa) | `cert-dgii/servicio/nombre` |
| **PROD** | Producción | `prod/servicio/nombre` |

**Principio:** El código es idéntico en todos los ambientes. Lo único que cambia es la variable de entorno `ENVIRONMENT` que selecciona la configuración correcta.

### 4. Patrón de Configuración Centralizada

```
Estructura conceptual:

CONFIGURACION[AMBIENTE] = {
    secrets: {
        database: "nombre-del-secreto-en-secrets-manager",
        api_externa: "nombre-del-secreto",
    },
    parameters: {
        api_key_interna: "/ruta/en/parameter-store",
        url_servicio: "/ruta/url",
    },
    resources: {
        bucket_documentos: "nombre-del-bucket",
        sns_topic_proceso: "arn:aws:sns:region:account:nombre-topic",
        cognito_pool_id: "region_XXXXXXX",
    },
}
```

### 5. Seguridad - Reglas de Acceso

| Regla | Detalle |
|-------|---------|
| Least privilege | Cada servicio tiene solo los permisos que necesita |
| IRSA en K8s / Instance Profile en EB | No hardcodear access keys |
| STS assume-role para cross-account | Roles dedicados con permisos limitados |
| Encryption at rest | S3, RDS, Secrets Manager encriptados por defecto |
| VPC endpoints | Acceso a servicios AWS sin salir a internet (donde aplique) |
| No access keys en código | Usar roles de IAM, nunca credenciales estáticas |

### 6. Cross-Account Access (STS)

Cuando se necesita acceder a recursos en otra cuenta AWS:

```
Flujo:
1. El servicio asume un rol en la cuenta destino (STS AssumeRole)
2. Recibe credenciales temporales (AccessKey + SecretKey + SessionToken)
3. Usa esas credenciales para acceder al recurso (DynamoDB, S3, etc.)
4. Las credenciales expiran automáticamente
```

**Cuándo se usa:** Acceso a DynamoDB compartido, S3 de otra cuenta, recursos centralizados.

### 7. Autenticación con Cognito

Flujo de autenticación en la empresa:

```
1. Usuario envía credenciales al endpoint de login
2. El backend autentica contra Cognito User Pool
3. Cognito retorna tokens (access_token, id_token, refresh_token)
4. El frontend envía el access_token en header Authorization: Bearer
5. El backend valida el JWT contra JWKS de Cognito (firma + expiración + issuer)
6. Si es válido → permite la operación
7. Si el token expira → el frontend usa refresh_token para obtener uno nuevo
```

Variantes:
- **API interna (entre servicios):** valida API key via Parameter Store (header `x-api-key`)
- **API externa (usuarios):** valida JWT de Cognito
- **Integración con terceros:** API key específica por cliente

### 8. Infraestructura como Código (CDK)

Todo recurso AWS nuevo se crea via **AWS CDK en Python**:

- Un stack por dominio (networking, database, compute, etc.)
- Configuración por ambiente via context o config files
- Tags obligatorios: Environment, Project, Team, CostCenter
- Tests de snapshot por stack
- Secrets y parámetros creados via CDK, no manualmente

Ver la estructura detallada en: `.cursor/rules/aws-cdk.mdc`

### 9. Reglas para el Agente

1. **Secrets Manager para datos sensibles**, Parameter Store para configuración.
2. **Nunca hardcodear credenciales** — todo via IAM roles o secrets.
3. **Configuración por ambiente** indexada por variable `ENVIRONMENT`.
4. **CDK para crear recursos** — no CloudFormation manual ni consola.
5. **STS assume-role** para acceso cross-account.
6. **SNS/EventBridge para disparar procesos**, no cron directo.
7. **S3 para archivos**, con presigned URLs para acceso temporal.
8. **Cognito para auth de usuarios**, API key para auth entre servicios.
9. **Todo encriptado** — no crear recursos sin encryption at rest.
10. **Cache de secretos/parámetros** en runtime — no consultar en cada request.

## Output

Al aplicar este skill, el agente:
1. Elige el servicio AWS correcto según la necesidad
2. Aplica el patrón de configuración por ambiente
3. Genera código de acceso al servicio con manejo de errores
4. Sugiere el recurso CDK si se necesita crear infraestructura
5. Respeta las reglas de seguridad (no access keys, encryption, least privilege)
