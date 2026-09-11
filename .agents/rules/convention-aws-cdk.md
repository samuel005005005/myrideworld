---
description: Convenciones AWS CDK Python (IaC)
globs: **/cdk.json
alwaysApply: false
---
# Estructura Base - AWS CDK Python (Infrastructure as Code)

## Propósito

Define la estructura y convenciones para proyectos de infraestructura con AWS CDK en Python. Se activa al trabajar con proyectos que contienen `cdk.json`.

---

## Estructura de Proyecto - CDK Python

```
📁 infra/
├── app.py                                 # Entry point CDK
│
├── 📁 stacks/                             # Stacks por dominio/servicio
│   ├── __init__.py
│   ├── networking_stack.py
│   ├── database_stack.py
│   ├── compute_stack.py
│   ├── api_stack.py
│   └── monitoring_stack.py
│
├── 📁 constructs/                         # Constructs reutilizables (L3)
│   ├── __init__.py
│   ├── secure_bucket.py
│   ├── fargate_service.py
│   └── api_gateway.py
│
├── 📁 config/                             # Configuración por ambiente
│   ├── __init__.py
│   ├── environments.py                    # Dataclass con config por env
│   ├── dev.py
│   ├── staging.py
│   └── prod.py
│
├── 📁 aspects/                            # CDK Aspects (compliance, tagging)
│   ├── __init__.py
│   ├── tagging_aspect.py
│   └── security_aspect.py
│
├── 📁 tests/                              # Tests de infraestructura
│   ├── __init__.py
│   ├── test_networking_stack.py
│   ├── test_compute_stack.py
│   └── conftest.py
│
├── cdk.json
├── pyproject.toml
└── requirements.txt
```

---

## Patrones por Capa

### Entry Point (app.py)

```python
#!/usr/bin/env python3
import aws_cdk as cdk

from config.environments import get_environment_config
from stacks.networking_stack import NetworkingStack
from stacks.database_stack import DatabaseStack
from stacks.compute_stack import ComputeStack
from stacks.monitoring_stack import MonitoringStack
from aspects.tagging_aspect import TaggingAspect

app = cdk.App()

env_name = app.node.try_get_context("env") or "dev"
config = get_environment_config(env_name)

env = cdk.Environment(
    account=config.account_id,
    region=config.region,
)

networking = NetworkingStack(app, f"{config.project}-{env_name}-networking", env=env, config=config)
database = DatabaseStack(app, f"{config.project}-{env_name}-database", env=env, config=config, vpc=networking.vpc)
compute = ComputeStack(app, f"{config.project}-{env_name}-compute", env=env, config=config, vpc=networking.vpc)
monitoring = MonitoringStack(app, f"{config.project}-{env_name}-monitoring", env=env, config=config)

# Aplicar tags globales
cdk.Aspects.of(app).add(TaggingAspect(config))

app.synth()
```

### Configuración por Ambiente

```python
# config/environments.py
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class EnvironmentConfig:
    env_name: str
    account_id: str
    region: str
    project: str
    team: str
    cost_center: str

    # Compute
    desired_count: int = 1
    cpu: int = 256
    memory: int = 512
    min_capacity: int = 1
    max_capacity: int = 4

    # Database
    db_instance_class: str = "db.t3.micro"
    db_multi_az: bool = False
    db_deletion_protection: bool = False

    # Feature flags
    enable_waf: bool = False
    enable_alarms: bool = False


def get_environment_config(env_name: str) -> EnvironmentConfig:
    configs = {
        "dev": EnvironmentConfig(
            env_name="dev",
            account_id="123456789012",
            region="us-east-1",
            project="mi-proyecto",
            team="desarrollo",
            cost_center="TI-001",
            desired_count=1,
            cpu=256,
            memory=512,
        ),
        "staging": EnvironmentConfig(
            env_name="staging",
            account_id="123456789012",
            region="us-east-1",
            project="mi-proyecto",
            team="desarrollo",
            cost_center="TI-001",
            desired_count=2,
            cpu=512,
            memory=1024,
            db_instance_class="db.t3.small",
            enable_alarms=True,
        ),
        "prod": EnvironmentConfig(
            env_name="prod",
            account_id="987654321098",
            region="us-east-1",
            project="mi-proyecto",
            team="desarrollo",
            cost_center="TI-001",
            desired_count=3,
            cpu=1024,
            memory=2048,
            min_capacity=3,
            max_capacity=10,
            db_instance_class="db.r6g.large",
            db_multi_az=True,
            db_deletion_protection=True,
            enable_waf=True,
            enable_alarms=True,
        ),
    }
    if env_name not in configs:
        raise ValueError(f"Ambiente '{env_name}' no configurado. Opciones: {list(configs.keys())}")
    return configs[env_name]
```

### Stack

```python
# stacks/compute_stack.py
from dataclasses import dataclass

import aws_cdk as cdk
from aws_cdk import (
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecs_patterns as ecs_patterns,
    aws_logs as logs,
)
from constructs import Construct

from config.environments import EnvironmentConfig


@dataclass
class ComputeStackProps:
    config: EnvironmentConfig
    vpc: ec2.IVpc


class ComputeStack(cdk.Stack):
    """Stack de cómputo: ECS Fargate services."""

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        config: EnvironmentConfig,
        vpc: ec2.IVpc,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self._config = config
        self._vpc = vpc

        self.cluster = self._create_cluster()
        self.service = self._create_fargate_service()

    def _create_cluster(self) -> ecs.Cluster:
        return ecs.Cluster(
            self,
            "Cluster",
            vpc=self._vpc,
            container_insights=True,
        )

    def _create_fargate_service(self) -> ecs_patterns.ApplicationLoadBalancedFargateService:
        return ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            "ApiService",
            cluster=self.cluster,
            desired_count=self._config.desired_count,
            task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                image=ecs.ContainerImage.from_asset("../src"),
                container_port=8000,
                log_driver=ecs.LogDrivers.aws_logs(
                    stream_prefix="api",
                    log_retention=logs.RetentionDays.ONE_MONTH,
                ),
            ),
            cpu=self._config.cpu,
            memory_limit_mib=self._config.memory,
            public_load_balancer=True,
        )
```

### Construct Reutilizable (L3)

```python
# constructs/secure_bucket.py
import aws_cdk as cdk
from aws_cdk import aws_s3 as s3
from constructs import Construct

from config.environments import EnvironmentConfig


class SecureBucket(Construct):
    """Construct L3: Bucket S3 con mejores prácticas de seguridad."""

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        config: EnvironmentConfig,
        versioned: bool = True,
    ) -> None:
        super().__init__(scope, construct_id)

        removal_policy = (
            cdk.RemovalPolicy.RETAIN if config.env_name == "prod"
            else cdk.RemovalPolicy.DESTROY
        )

        self.bucket = s3.Bucket(
            self,
            "Bucket",
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            enforce_ssl=True,
            versioned=versioned,
            removal_policy=removal_policy,
            auto_delete_objects=config.env_name != "prod",
        )
```

### Aspect (Compliance)

```python
# aspects/tagging_aspect.py
import aws_cdk as cdk
import jsii
from constructs import IConstruct

from config.environments import EnvironmentConfig


@jsii.implements(cdk.IAspect)
class TaggingAspect:
    """Aplica tags obligatorios a todos los recursos del app."""

    def __init__(self, config: EnvironmentConfig) -> None:
        self._config = config

    def visit(self, node: IConstruct) -> None:
        if isinstance(node, cdk.Stack):
            cdk.Tags.of(node).add("Environment", self._config.env_name)
            cdk.Tags.of(node).add("Project", self._config.project)
            cdk.Tags.of(node).add("Team", self._config.team)
            cdk.Tags.of(node).add("CostCenter", self._config.cost_center)
            cdk.Tags.of(node).add("ManagedBy", "cdk")
```

### Test

```python
# tests/test_compute_stack.py
import aws_cdk as cdk
from aws_cdk import assertions

from stacks.networking_stack import NetworkingStack
from stacks.compute_stack import ComputeStack
from config.environments import get_environment_config


def test_compute_stack_creates_fargate_service():
    app = cdk.App()
    config = get_environment_config("dev")
    env = cdk.Environment(account="123456789012", region="us-east-1")

    networking = NetworkingStack(app, "TestNetworking", env=env, config=config)
    stack = ComputeStack(app, "TestCompute", env=env, config=config, vpc=networking.vpc)

    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::ECS::Service", {
        "DesiredCount": 1,
    })
    template.resource_count_is("AWS::ECS::Cluster", 1)


def test_compute_stack_prod_has_higher_resources():
    app = cdk.App()
    config = get_environment_config("prod")
    env = cdk.Environment(account="987654321098", region="us-east-1")

    networking = NetworkingStack(app, "TestNetworking", env=env, config=config)
    stack = ComputeStack(app, "TestCompute", env=env, config=config, vpc=networking.vpc)

    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::ECS::Service", {
        "DesiredCount": 3,
    })
```

---

## Comandos CDK

| Acción | Comando |
|--------|---------|
| Instalar dependencias | `pip install -r requirements.txt` |
| Sintetizar (generar CloudFormation) | `cdk synth -c env=dev` |
| Diff (ver cambios) | `cdk diff -c env=dev` |
| Deploy | `cdk deploy --all -c env=dev` |
| Deploy stack específico | `cdk deploy StackName -c env=dev` |
| Destroy | `cdk destroy --all -c env=dev` |
| Tests | `pytest tests/` |
| Listar stacks | `cdk list -c env=dev` |

---

## Convenciones CDK Python

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Stacks | PascalCase + Stack | `NetworkingStack` |
| Constructs | PascalCase | `SecureBucket` |
| Config dataclasses | PascalCase + Config | `EnvironmentConfig` |
| IDs lógicos | PascalCase descriptivo | `ApiGatewayRestApi` |
| Archivos | snake_case | `networking_stack.py` |
| Environments | lowercase | `dev`, `staging`, `prod` |
| Tags | PascalCase keys | `Environment`, `Project`, `Team` |
| Variables | snake_case | `desired_count` |

---

## Servicios AWS Comunes

| Servicio | Cuándo usar |
|----------|-------------|
| **ECS Fargate** | Microservicios containerizados sin gestionar servidores |
| **EKS** | Kubernetes administrado (workloads complejos) |
| **Lambda** | Funciones event-driven, bajo tráfico o spiky |
| **API Gateway** | REST/HTTP APIs con throttling, auth |
| **RDS** | BD relacional gestionada (PostgreSQL, MySQL) |
| **DynamoDB** | NoSQL, alta disponibilidad, baja latencia |
| **S3** | Almacenamiento de objetos, archivos estáticos |
| **CloudFront** | CDN para assets y APIs |
| **SQS/SNS** | Messaging async, desacoplamiento |
| **Secrets Manager** | Gestión de secretos (connection strings, API keys) |
| **Parameter Store** | Configuración no secreta por ambiente |
| **CloudWatch** | Logs, métricas, alarmas |
| **WAF** | Protección web (rate limiting, geo blocking) |
| **Cognito** | Autenticación de usuarios |
| **EventBridge** | Eventos entre servicios |

---

## Reglas para el Agente

1. **Python como lenguaje CDK**. No generar CDK en TypeScript a menos que se indique.
2. **Un stack por dominio/responsabilidad**. No mega-stacks con todo.
3. **Constructs L3 para patrones repetidos**. Si copias infra, extrae un construct.
4. **Dataclasses para configuración** por ambiente. Tipado fuerte, inmutable (`frozen=True`).
5. **Tags obligatorios** en todos los recursos: `Environment`, `Project`, `Team`, `CostCenter`.
6. **Aspects para compliance**. Encryption at rest, HTTPS only, logging habilitado.
7. **No hardcodear ARNs ni account IDs**. Usar `cdk.Aws.ACCOUNT_ID`, `cdk.Aws.REGION`, o config.
8. **Secrets en Secrets Manager**, nunca en código ni en environment variables del CDK.
9. **Removal policies explícitas**. `RETAIN` en producción para datos, `DESTROY` en dev.
10. **Tests con pytest + assertions**. Mínimo un test por stack.
11. **Permisos con least privilege**. No `*` en policies. Usar `grant*()` methods del CDK.
12. **VPC compartida** entre stacks vía props. No crear VPC por stack.
13. **Naming convention**: `{proyecto}-{ambiente}-{recurso}` para recursos con nombre fijo.
14. **Context (`-c env=xxx`)** para seleccionar ambiente. No branches por env.
