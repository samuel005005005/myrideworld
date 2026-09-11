---
description: Activa convención correcta según lenguaje/archivo
alwaysApply: false
---
# Estructura por Lenguaje / Tecnología

Según el archivo que se esté editando, lee y aplica la convention correspondiente:

## Lenguajes

- .NET (C#): `.agents/rules/convention-dotnet.md`
- Java: `.agents/rules/convention-java.md`
- Kotlin: `.agents/rules/convention-kotlin.md`
- Python: `.agents/rules/convention-python.md`
- TypeScript/JS: `.agents/rules/convention-typescript.md` (**prohibido `Record<>`**; **una clase/interfaz exportada por archivo**; request tipados `ReqConductor` / `CabecerasHttp`)
- Dart: `.agents/rules/convention-dart.md` (**una clase pública por archivo**; excepción Widget+State)
- Kotlin: `.agents/rules/convention-kotlin.md` (**una clase/interfaz por archivo**; excepción sealed raíz + variantes)
- JavaScript: `.agents/rules/convention-javascript.md`
- Dart/Flutter: `.agents/rules/convention-dart.md`

## Frameworks

- FastAPI: `.agents/rules/convention-fastapi.md`
- Angular: `.agents/rules/convention-angular.md`
- React: `.agents/rules/convention-react.md`

## Infraestructura

- AWS CDK: `.agents/rules/convention-aws-cdk.md`
- Kubernetes / EKS: `.agents/rules/convention-kubernetes.md`
- Pipelines CI/CD: `.agents/rules/convention-pipelines.md`

Las conventions también se activan automáticamente por `globs` al trabajar con archivos del lenguaje.
