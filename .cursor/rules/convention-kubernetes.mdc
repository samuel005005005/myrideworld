---
description: Convenciones Kubernetes/EKS manifiestos
globs: **/{deployment,service,ingress,configmap,kustomization}.{yaml,yml}
alwaysApply: false
---
# Estructura Base - Kubernetes / EKS

## Propósito

Define la estructura y convenciones para manifiestos Kubernetes y despliegues en EKS. Se activa al trabajar con archivos de manifiesto K8s.

---

## Estructura de Proyecto - Kubernetes Manifests

```
📁 k8s/
├── 📁 base/                               # Manifiestos base (Kustomize)
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── hpa.yaml
│   └── ingress.yaml
│
├── 📁 overlays/                           # Variantes por ambiente
│   ├── 📁 dev/
│   │   ├── kustomization.yaml
│   │   ├── patches/
│   │   │   └── deployment-resources.yaml
│   │   └── configmap.yaml
│   ├── 📁 staging/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   └── 📁 prod/
│       ├── kustomization.yaml
│       ├── patches/
│       │   ├── deployment-resources.yaml
│       │   └── hpa.yaml
│       └── configmap.yaml
│
└── 📁 charts/                             # Helm charts (si aplica)
    └── 📁 mi-servicio/
        ├── Chart.yaml
        ├── values.yaml
        ├── 📁 values/
        │   ├── dev.yaml
        │   ├── staging.yaml
        │   └── prod.yaml
        └── 📁 templates/
            ├── deployment.yaml
            ├── service.yaml
            ├── ingress.yaml
            ├── configmap.yaml
            ├── hpa.yaml
            └── _helpers.tpl
```

---

## Convenciones Kubernetes

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Namespaces | kebab-case | `mi-proyecto` |
| Deployments | kebab-case | `api-usuarios` |
| Services | kebab-case | `api-usuarios-svc` |
| ConfigMaps | kebab-case + `-config` | `api-usuarios-config` |
| Secrets | kebab-case + `-secret` | `api-usuarios-secret` |
| Labels | kebab-case keys | `app.kubernetes.io/name` |
| Imágenes | registry/proyecto/servicio:tag | `ecr.aws/mi-org/api:v1.2.3` |

---

## Labels Estándar (Obligatorios)

```yaml
metadata:
  labels:
    app.kubernetes.io/name: api-usuarios
    app.kubernetes.io/instance: api-usuarios-prod
    app.kubernetes.io/version: "1.2.3"
    app.kubernetes.io/component: backend
    app.kubernetes.io/part-of: mi-proyecto
    app.kubernetes.io/managed-by: kustomize
```

---

## Recursos por Ambiente

| Recurso | Dev | Staging | Prod |
|---------|-----|---------|------|
| Replicas | 1 | 2 | 3+ |
| CPU request | 100m | 250m | 500m |
| CPU limit | 250m | 500m | 1000m |
| Memory request | 128Mi | 256Mi | 512Mi |
| Memory limit | 256Mi | 512Mi | 1Gi |
| HPA | No | Sí (2-4) | Sí (3-10) |

---

## Reglas para el Agente

1. **Kustomize sobre Helm** para customización simple. Helm para charts compartidos/complejos.
2. **Base + Overlays**. Nunca modificar manifiestos de producción directamente.
3. **Resource requests y limits siempre**. Sin ellos el scheduler no puede planificar bien.
4. **Health checks** (liveness + readiness probes) en todo deployment.
5. **No usar `latest` tag**. Siempre versiones específicas o SHA del commit.
6. **Secrets vía External Secrets Operator** o Sealed Secrets. Nunca en plain text en el repo.
7. **PodDisruptionBudget** en producción para alta disponibilidad.
8. **NetworkPolicies** para limitar tráfico entre pods.
9. **ServiceAccount dedicado** por deployment con IRSA (EKS).
10. **HPA basado en métricas reales** (CPU, memoria, o custom metrics).
11. **Labels estándar** en todos los recursos para observabilidad.
12. **Namespace por equipo o dominio**. No compartir namespace entre servicios no relacionados.
