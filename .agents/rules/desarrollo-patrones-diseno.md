---
description: Cuándo aplicar Strategy, Observer, Factory y otros patrones
alwaysApply: false
---
# Patrones de Diseño

## Propósito

Guía de decisión para que el agente aplique patrones de diseño automáticamente cuando el contexto lo requiera. No necesitas pedir explícitamente un patrón — el agente lo detecta y lo implementa.

---

## Cuándo Aplicar Cada Patrón

### Patrones Creacionales

| Patrón | Aplicar cuando... | Ejemplo de trigger |
|--------|-------------------|-------------------|
| **Factory Method** | Se necesita crear objetos sin exponer la lógica de instanciación, o cuando hay múltiples variantes de un objeto | "Crear entidad con validación", "Diferentes tipos de notificación" |
| **Abstract Factory** | Se necesitan familias de objetos relacionados que varíen juntos | "Soporte multi-BD", "Multi-proveedor de pagos" |
| **Builder** | El objeto tiene muchos parámetros opcionales o configuraciones complejas | "Crear query con filtros opcionales", "Configurar reporte con múltiples opciones" |
| **Singleton** | Se necesita una única instancia global (úsalo con cautela, preferir DI) | "Pool de conexiones", "Configuración de app" |
| **Prototype** | Se necesita clonar objetos costosos de crear | "Templates de documentos", "Configuraciones base" |

### Patrones Estructurales

| Patrón | Aplicar cuando... | Ejemplo de trigger |
|--------|-------------------|-------------------|
| **Adapter** | Se integra un sistema externo con una interfaz incompatible | "Integrar API de terceros", "Migrar de una librería a otra" |
| **Decorator** | Se necesita agregar comportamiento a un objeto sin modificar su clase | "Agregar logging a un servicio", "Agregar cache a un repositorio", "Agregar validación" |
| **Facade** | Se necesita simplificar la interacción con un subsistema complejo | "Orquestar múltiples servicios", "Simplificar API de librería externa" |
| **Proxy** | Se necesita controlar el acceso a un objeto (cache, lazy loading, auth) | "Cache de consultas pesadas", "Lazy loading de relaciones" |
| **Composite** | Se trabaja con estructuras jerárquicas (árbol) | "Menús anidados", "Permisos jerárquicos", "Categorías con subcategorías" |

### Patrones de Comportamiento

| Patrón | Aplicar cuando... | Ejemplo de trigger |
|--------|-------------------|-------------------|
| **Strategy** | Existen múltiples algoritmos intercambiables para una operación | "Diferentes formas de cálculo", "Múltiples proveedores", "Diferentes métodos de pago" |
| **Observer / Event** | Un cambio en un objeto debe notificar a otros sin acoplamiento | "Enviar email al crear usuario", "Auditoría de cambios", "Notificaciones" |
| **Command** | Se necesita encapsular una operación como objeto (undo, queue, log) | "Operaciones reversibles", "Cola de tareas", "Historial de acciones" |
| **Template Method** | Varios procesos comparten estructura pero varían en pasos específicos | "Proceso de importación con diferentes formatos", "Flujos de aprobación" |
| **Chain of Responsibility** | Múltiples handlers pueden procesar una solicitud | "Pipeline de validaciones", "Middlewares", "Cadena de aprobaciones" |
| **State** | El comportamiento de un objeto cambia según su estado interno | "Flujo de estados de un pedido", "Máquina de estados de un documento" |
| **Specification** | Se necesitan reglas de negocio combinables y reutilizables | "Filtros complejos", "Reglas de elegibilidad", "Validaciones compuestas" |

### Patrones Arquitectónicos (ya cubiertos en Clean Arch)

| Patrón | Aplicar cuando... |
|--------|-------------------|
| **Repository** | Siempre para acceso a datos (ya es parte del estándar) |
| **Unit of Work** | Transacciones que involucran múltiples agregados |
| **CQRS** | Lecturas y escrituras tienen requisitos muy diferentes |
| **Mediator** | Desacoplar la comunicación entre componentes (MediatR, eventos internos) |
| **Domain Events** | Efectos secundarios que deben ocurrir tras una acción de dominio |

---

## Implementación por Lenguaje

### Strategy

```
// Kotlin / Java
interface EstrategiaPrecio {
    fun calcular(base: BigDecimal, cantidad: Int): BigDecimal
}
class PrecioMayorista : EstrategiaPrecio { ... }
class PrecioMinorista : EstrategiaPrecio { ... }

// TypeScript
interface EstrategiaPrecio {
    calcular(base: number, cantidad: number): number;
}

// Python
class EstrategiaPrecio(ABC):
    @abstractmethod
    def calcular(self, base: Decimal, cantidad: int) -> Decimal: ...

// Dart
abstract class EstrategiaPrecio {
    double calcular(double base, int cantidad);
}
```

### Observer / Domain Events

```
// El patrón preferido es Domain Events:
// 1. La entidad registra el evento
// 2. Un despachador lo publica después de persistir
// 3. Los handlers reaccionan sin acoplamiento

// Entidad
usuario.desactivar()  // internamente agrega UsuarioDesactivadoEvent

// Handler (en otro lugar, desacoplado)
class EnviarEmailAlDesactivar : IEventHandler<UsuarioDesactivadoEvent>
```

### Decorator

```
// Ideal para agregar cross-cutting concerns sin modificar el servicio original:
// - CacheRepositoryDecorator(realRepo)
// - LoggingServiceDecorator(realService)
// - RetryHttpClientDecorator(realClient)

// Implementa la misma interfaz y envuelve la implementación original
```

### Builder

```
// Usar cuando un objeto tiene más de 4 parámetros opcionales
// En Kotlin: usar named parameters + valores por defecto (no necesitas Builder explícito)
// En Java: Builder clásico o records con @Builder de Lombok
// En TypeScript: objeto de opciones con Partial<T>
// En Dart: named parameters con valores por defecto
```

---

## Reglas para el Agente

1. **No sobre-ingeniar**. Aplica un patrón solo cuando el problema lo justifica. Si una solución simple funciona, úsala.
2. **Detecta la necesidad**. Si ves un `if/else` con muchas ramas del mismo tipo → probablemente es Strategy. Si ves efectos secundarios dispersos → probablemente son Domain Events.
3. **Nombra explícitamente** el patrón en un comentario al implementarlo para que el equipo lo reconozca.
4. **Prefiere composición**. La mayoría de patrones se implementan mejor con interfaces + inyección que con herencia.
5. **Un patrón por problema**. No combines 3 patrones donde uno basta.
6. **Sugiere al usuario** antes de implementar un patrón complejo (State machine, CQRS). Confirma que la complejidad se justifica.
7. **Respeta los patrones existentes** en el proyecto. Si ya usan Strategy para algo, sigue el mismo estilo.
8. **Domain Events sobre Observer directo** en el contexto de Clean Architecture.
9. **No uses Singleton** si puedes resolver con DI (Scoped/Transient en .NET, @Singleton en Hilt, Provider en Riverpod).
10. **Builder en Java, named params en Kotlin/Dart/Python**. No crees un Builder donde el lenguaje ya lo resuelve.
