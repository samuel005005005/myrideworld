---
description: CDK Python, límites Dev vs Infra, Parameter Store, SNS
alwaysApply: false
---
# Infraestructura como Código (IaC) - AWS / la empresa

## Propósito

Reglas y convenciones para generar infraestructura segura, reproducible y mantenible usando AWS CDK Python. Refleja los patrones reales de la empresa: Secrets Manager, Parameter Store, Cognito, SNS para procesos batch, S3, DynamoDB cross-account y deploy en ECS Fargate.

---

## Principios Fundamentales

1. **Todo es código (CDK Python)**. Ningún recurso se crea manualmente en consola.
2. **Inmutable**. No modificar recursos en caliente; redesplegar.
3. **Reproducible**. Cualquier ambiente se puede recrear con `cdk deploy -c env=xxx`.
4. **Versionado**. La infra vive en el mismo repo (carpeta `infra/`) o repo dedicado.
5. **Least privilege**. IAM policies con el mínimo permiso necesario.
6. **Config por ambiente**. Diccionario `ENTORNO` con dev/cert/prod (patrón la empresa).

---

## Límites de Responsabilidad (Desarrollo vs Infra)

| Recurso | Quién lo crea | Herramienta |
|---------|---------------|-------------|
| VPC, Subnets, Route Tables, NAT Gateway | Equipo de Infraestructura | Manual / Terraform |
| Security Groups | Desarrollo (CDK) | AWS CDK |
| ECS/EKS/Lambda (compute) | Desarrollo (CDK) | AWS CDK |
| RDS, DynamoDB (base de datos) | Desarrollo (CDK) | AWS CDK |
| S3 Buckets | Desarrollo (CDK) | AWS CDK |
| SNS Topics, SQS Queues | Desarrollo (CDK) | AWS CDK |
| Parameter Store (credenciales) | Desarrollo (CDK) con valor placeholder | AWS CDK |
| Valor real de credenciales | Equipo de Infraestructura / Pipeline | Manual o variables del pipeline CI |
| CloudWatch Alarms | Desarrollo (CDK) | AWS CDK |
| WAF, CloudFront | Depende del caso | Coordinación con Infra |

**Regla clave:** CDK del proyecto NUNCA crea VPC ni subnets. Solo referencia las existentes via lookup o parámetro.

---

## Credenciales: Parameter Store SecureString (NO Secrets Manager)

**Decisión de arquitectura:** Usar Parameter Store con tipo SecureString en lugar de Secrets Manager por costo.

| Aspecto | Parameter Store SecureString | Secrets Manager |
|---------|------------------------------|-----------------|
| Costo | Gratis (estándar) / bajo (advanced) | $0.40/secreto/mes |
| Encryption | KMS (mismo nivel de seguridad) | KMS |
| Rotación automática | No nativa (se implementa manual) | Sí |
| **Decisión la empresa** | **Usar este** | Solo si se necesita rotación automática |

### Patrón en CDK: crear con placeholder

```python
from aws_cdk import aws_ssm as ssm

# CDK crea el parámetro con valor dummy
# El valor real lo pone Infra o el pipeline después
ssm.StringParameter(
    self, "DbConnectionString",
    parameter_name=f"/{env_name}/{project}/db-connection-string",
    string_value="PLACEHOLDER_VALOR_REAL_LO_PONE_INFRA",
    type=ssm.ParameterType.SECURE_STRING,
    description="Connection string de BD - valor real configurado por Infra",
)
```

### Patrón en Pipeline: leer desde Parameter Store

```yaml
# Azure Pipelines lee el valor real desde SSM
variables:
  - name: DB_CONNECTION_STRING
    value: $[az.ssm.getParameter('/prod/mi-servicio/db-connection-string')]
```

### Patrón en la aplicación: leer en runtime

```python
# La app lee el valor real en runtime via boto3
import boto3

def get_parameter(name: str) -> str:
    client = boto3.client("ssm")
    response = client.get_parameter(Name=name, WithDecryption=True)
    return response["Parameter"]["Value"]
```

---

## Servicios AWS Usados en la empresa

| Servicio | Uso en la empresa |
|----------|-------------------|
| **Parameter Store (SecureString)** | Credenciales, connection strings, API keys (preferido sobre Secrets Manager) |
| **Secrets Manager** | Solo si se necesita rotación automática (caso excepcional) |
| **Cognito** | Autenticación de usuarios (JWT, JWKS, User Pools) |
| **S3** | Documentos, facturas PDF, archivos de intercambio |
| **SNS** | Disparar procesos batch (reenvíos, reprocesos) |
| **SQS** | Colas de mensajes entre servicios |
| **Lambda** | Funciones auxiliares (firmar XML, procesamiento puntual) |
| **DynamoDB** | Datos NoSQL, acceso cross-account via STS |
| **STS** | Assume-role para acceso entre cuentas AWS |
| **ECS Fargate** | Deploy de APIs (migración desde Elastic Beanstalk) |
| **CloudWatch** | Logs, métricas, alarmas |
| **WAF** | Protección de APIs públicas |

---

## Patrón de Configuración por Ambiente (la empresa)

En la aplicación, la configuración se maneja con variable de entorno `ENVIRONMENT`:

```python
# shared/constantes.py — patrón real de la empresa
import os

ENVIRONMENT = os.getenv("ENVIRONMENT", "DEV")

ENTORNO = {
    "DEV": {
        "secret_db": "dev/mi-servicio/db-credentials",
        "parameter_api_key": "/dev/mi-servicio/api-key-interna",
        "bucket_documentos": "dev-mi-servicio-documentos",
        "sns_topic_reenvio": "arn:aws:sns:us-east-1:123456789:dev-reenvio-facturas",
        "cognito_pool_id": "us-east-1_XXXXXXX",
        "cognito_client_id": "xxxxxxxxxxxxxxxxx",
    },
    "CERT": { ... },
    "PROD": { ... },
}

config = ENTORNO[ENVIRONMENT]
```

En CDK, esto se traduce a crear los recursos con nombres que coincidan:

```python
# En el stack CDK
secret = secretsmanager.Secret(
    self, "DbCredentials",
    secret_name=f"{env_name}/mi-servicio/db-credentials",
)

parameter = ssm.StringParameter(
    self, "ApiKeyInterna",
    parameter_name=f"/{env_name}/mi-servicio/api-key-interna",
    string_value="valor-inicial",
)
```

---

## Secrets Manager vs Parameter Store

| Criterio | Secrets Manager | Parameter Store |
|----------|----------------|-----------------|
| **Datos sensibles** (passwords, tokens, connection strings) | ✅ Usar | ❌ No |
| **Configuración por ambiente** (URLs, flags, nombres) | ❌ No | ✅ Usar |
| **Rotación automática** | ✅ Soporta | ❌ No |
| **Costo** | $0.40/secreto/mes | Gratis (estándar) |
| **Naming la empresa** | `{env}/{servicio}/{nombre}` | `/{env}/{servicio}/{nombre}` |

---

## SNS como Trigger de Procesos Batch

Patrón la empresa: los procesos batch NO usan cron/celery. Se disparan via **SNS topics** que hacen HTTP POST a endpoints ocultos del API.

```
[CloudWatch Event / Manual] → SNS Topic → HTTP POST → /proceso/reenviar-facturas
```

En CDK:

```python
from aws_cdk import aws_sns as sns, aws_sns_subscriptions as subs

topic = sns.Topic(self, "ReenvioFacturas",
    topic_name=f"{env_name}-reenvio-facturas",
)

# Suscripción HTTP al endpoint del API
topic.add_subscription(subs.UrlSubscription(
    f"https://api.{domain}/external/proceso/reenviar-facturas",
    protocol=sns.SubscriptionProtocol.HTTPS,
))
```

---

## DynamoDB Cross-Account (STS)

Patrón para acceder a DynamoDB en otra cuenta AWS:

```python
from aws_cdk import aws_iam as iam

# En el stack de la cuenta que ASUME el rol
assume_role_policy = iam.PolicyStatement(
    actions=["sts:AssumeRole"],
    resources=[f"arn:aws:iam::{target_account}:role/{role_name}"],
)
```

---

## Reglas para el Agente

1. **CDK Python siempre**. No CloudFormation YAML manual, no Terraform.
2. **Parameter Store SecureString** para credenciales (no Secrets Manager, por costo).
3. **Credenciales con valor placeholder** en CDK — el valor real lo pone Infra o el pipeline.
4. **NUNCA crear VPC, subnets, route tables** — eso lo maneja el equipo de Infraestructura.
5. **SÍ crear:** Security Groups, ECS/EKS/Lambda, RDS, S3, SNS, SQS, CloudWatch alarms.
6. **SNS para disparar procesos batch**, no cron ni invocación directa.
7. **Tags obligatorios**: `Environment`, `Project`, `Team`, `CostCenter`, `ManagedBy=cdk`.
8. **ECS Fargate o EKS** como target de deploy (preguntar cuál).
9. **Cognito** para autenticación. No implementar auth custom.
10. **STS assume-role** para acceso cross-account.
11. **Ambientes**: DEV, CERT (certificación), PROD.
12. **No `*` en IAM**. Usar `grant*()` methods del CDK.
13. **Tests con pytest** para todo stack.
14. **Al iniciar un proyecto, preguntar**: arquitectura (ECS/EKS/Lambda), servicios AWS, y cómo se despliega.
