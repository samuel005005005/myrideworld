---
description: Convenciones CI/CD (Azure Pipelines, GitHub Actions)
globs: **/{azure-pipelines,pipeline,buildspec,Jenkinsfile,.github/workflows}*.{yaml,yml,groovy}
alwaysApply: false
---
# Estructura Base - CI/CD Pipelines

## Propósito

Define convenciones para pipelines de CI/CD en Azure Pipelines, GitHub Actions y AWS CodePipeline/CodeBuild. Se activa al trabajar con archivos de definición de pipeline.

---

## Estructura - Azure Pipelines

```
📁 pipelines/
├── 📁 templates/                          # Templates reutilizables
│   ├── build-dotnet.yml
│   ├── build-python.yml
│   ├── build-node.yml
│   ├── deploy-ecs.yml
│   ├── deploy-k8s.yml
│   └── security-scan.yml
│
├── 📁 stages/
│   ├── ci.yml                             # Build + Test + Scan
│   ├── cd-dev.yml                         # Deploy a dev
│   ├── cd-staging.yml                     # Deploy a staging
│   └── cd-prod.yml                        # Deploy a producción (con approval)
│
├── azure-pipelines.yml                    # Pipeline principal
└── azure-pipelines-pr.yml                 # Pipeline de PR (validación)
```

---

## Estructura - GitHub Actions

```
📁 .github/
├── 📁 workflows/
│   ├── ci.yml                             # Build + Test en PR
│   ├── cd-dev.yml                         # Deploy a dev on push to develop
│   ├── cd-prod.yml                        # Deploy a prod on release
│   └── security.yml                       # Scan periódico
│
└── 📁 actions/                            # Composite actions reutilizables
    ├── 📁 setup-node/
    │   └── action.yml
    └── 📁 deploy-ecs/
        └── action.yml
```

---

## Estructura - AWS (buildspec)

```
📁 pipeline/
├── buildspec-build.yml                    # CodeBuild: compilar
├── buildspec-test.yml                     # CodeBuild: tests
├── buildspec-deploy.yml                   # CodeBuild: deploy
├── appspec.yml                            # CodeDeploy
└── taskdef.json                           # ECS task definition template
```

---

## Etapas Estándar de Pipeline

| Etapa | Qué hace | Gate |
|-------|----------|------|
| **Build** | Compilar, resolver dependencias | - |
| **Unit Test** | Tests unitarios + cobertura | Min 80% cobertura |
| **Lint + Format** | Análisis estático de código | 0 errores |
| **Security Scan** | Dependencias + SAST | 0 críticos/altos |
| **Build Image** | Docker build + push a registry | - |
| **Deploy Dev** | Deploy automático a dev | - |
| **Integration Test** | Tests contra ambiente desplegado | Pass |
| **Deploy Staging** | Deploy a staging | - |
| **QA Sign-off** | Aprobación manual de QA | Manual |
| **Deploy Prod** | Deploy a producción | Aprobación + ventana |
| **Smoke Test** | Verificación post-deploy | Health OK |

---

## Convenciones de Pipelines

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Nombres de stages | PascalCase | `BuildAndTest` |
| Nombres de jobs | PascalCase | `RunUnitTests` |
| Variables | UPPER_SNAKE_CASE | `DOCKER_REGISTRY` |
| Secrets | UPPER_SNAKE_CASE | `AWS_ACCESS_KEY_ID` |
| Templates | kebab-case | `deploy-ecs.yml` |
| Artefactos | kebab-case + version | `api-usuarios-1.2.3.tar.gz` |

---

## Reglas para el Agente

1. **DRY en pipelines**. Usar templates/composite actions para lógica repetida.
2. **Secretos vía variable groups o secrets**. Nunca en el YAML.
3. **Versiones pinned** de actions/tasks. No usar `@latest` o `@main`.
4. **Cache de dependencias** (node_modules, .m2, pip cache) para acelerar builds.
5. **Fail fast**. Lint y unit tests primero; si fallan, no seguir con el resto.
6. **Approvals en producción**. Siempre gate manual antes de deploy a prod.
7. **Rollback automático**. Si smoke test falla post-deploy, revertir.
8. **Artefactos inmutables**. El mismo artefacto pasa por todos los ambientes.
9. **No rebuild por ambiente**. Build una vez, deploy N veces.
10. **Notificaciones** a Teams/Slack en fallos y deploys exitosos a prod.
11. **Branch policies**. PR a main requiere pipeline verde + al menos 1 reviewer.
12. **Limitar concurrencia**. No permitir deploys simultáneos al mismo ambiente.
