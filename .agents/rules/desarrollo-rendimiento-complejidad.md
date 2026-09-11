---
description: Big-O, estructuras de datos, anti-patrones N+1
alwaysApply: false
---
# Rendimiento y Complejidad Algorítmica

## Propósito

Reglas para que el agente siempre genere código con complejidad algorítmica óptima, eligiendo las estructuras de datos correctas y evitando patrones ineficientes.

---

## Regla Principal

**Antes de escribir un loop o una operación sobre colecciones, preguntarse:** ¿cuál es la complejidad de esto? ¿Existe una estructura de datos que lo resuelva en O(1) o O(log n) en lugar de O(n) o O(n²)?

---

## Complejidad: Lo Aceptable vs Lo Prohibido

| Complejidad | Aceptable para... | Prohibido cuando... |
|-------------|-------------------|---------------------|
| **O(1)** | Siempre ideal | — |
| **O(log n)** | Búsquedas, inserciones en estructuras ordenadas | — |
| **O(n)** | Recorrer una colección una vez, map/filter | Existe alternativa O(1) con un Set/Map |
| **O(n log n)** | Ordenamiento | Se ordena dentro de un loop |
| **O(n²)** | Solo datasets pequeños y fijos (<100 items) | Loops anidados sobre datos que pueden crecer |
| **O(n³)+** | Nunca en código de aplicación | Siempre |

---

## Estructuras de Datos: Cuándo Usar Cada Una

### Búsqueda "¿existe este elemento?"

```
❌ Lista + loop              → O(n) por cada búsqueda
✅ Set / HashSet             → O(1) por búsqueda

# MAL: O(n) en cada iteración → O(n²) total
if email in lista_emails:

# BIEN: O(1) por búsqueda
emails_existentes = set(lista_emails)
if email in emails_existentes:
```

### Búsqueda por clave "dame el elemento con ID X"

```
❌ Lista + filtro            → O(n) cada vez
✅ Dict / HashMap / Map      → O(1) por clave

# MAL: O(n) por cada consulta
usuario = next(u for u in usuarios if u.id == id_buscado)

# BIEN: O(1) con diccionario
usuarios_por_id = {u.id: u for u in usuarios}
usuario = usuarios_por_id[id_buscado]
```

### Agrupar elementos por propiedad

```
❌ Loop anidado para agrupar  → O(n²)
✅ Dict con defaultdict        → O(n)

# MAL
for categoria in categorias:
    productos_cat = [p for p in productos if p.categoria == categoria]

# BIEN
from collections import defaultdict
productos_por_categoria = defaultdict(list)
for p in productos:
    productos_por_categoria[p.categoria].append(p)
```

### Verificar duplicados

```
❌ Doble loop                → O(n²)
✅ Set para tracking         → O(n)

# MAL
for i in range(len(items)):
    for j in range(i+1, len(items)):
        if items[i] == items[j]: ...

# BIEN
vistos = set()
for item in items:
    if item in vistos:
        # duplicado
    vistos.add(item)
```

### Cola de prioridad / "dame el más grande/pequeño"

```
❌ Ordenar toda la lista cada vez  → O(n log n) repetido
✅ Heap / PriorityQueue            → O(log n) por inserción/extracción

# MAL
sorted_items = sorted(items, key=lambda x: x.prioridad)
siguiente = sorted_items[0]

# BIEN (si se consulta repetidamente)
import heapq
heapq.heappush(heap, (item.prioridad, item))
siguiente = heapq.heappop(heap)
```

### Conteo de frecuencias

```
❌ Loop con count() en cada iteración  → O(n²)
✅ Counter / dict                       → O(n)

# MAL
for item in items:
    frecuencia = items.count(item)  # O(n) dentro de un O(n)

# BIEN
from collections import Counter
frecuencias = Counter(items)
```

---

## Anti-Patrones Comunes

| Anti-patrón | Complejidad | Solución |
|-------------|-------------|----------|
| Loop dentro de loop sobre mismos datos | O(n²) | Precomputar con Set/Dict |
| `.find()` / `.indexOf()` en loop | O(n²) | Indexar con Map primero |
| Ordenar dentro de un loop | O(n² log n) | Ordenar una vez afuera |
| Concatenar strings en loop | O(n²) en algunos lenguajes | Usar StringBuilder / join / buffer |
| Consulta a BD dentro de loop (N+1) | O(n) queries | Eager loading / batch query |
| `.count()` o `.filter()` repetido en loop | O(n²) | Precomputar con Counter/Map |
| Re-crear colección en cada iteración | O(n²) memoria | Crear una vez, mutar o usar generator |

---

## Problema N+1 (Base de Datos)

```
❌ MAL: 1 query por cada item → N+1 queries
for pedido in pedidos:
    cliente = repository.obtener_por_id(pedido.cliente_id)  # 1 query por iteración

✅ BIEN: 1 query batch
cliente_ids = [p.cliente_id for p in pedidos]
clientes = repository.obtener_por_ids(cliente_ids)  # 1 sola query
clientes_map = {c.id: c for c in clientes}          # O(1) lookup
for pedido in pedidos:
    cliente = clientes_map[pedido.cliente_id]
```

---

## Reglas por Lenguaje

### Python
- Usar `set()` para membership testing, no listas.
- Usar `dict` comprehension para lookups.
- `collections.defaultdict` y `Counter` para agrupaciones.
- Generators (`yield`) para datos grandes que no necesitan cargarse en memoria.
- `itertools` para combinaciones eficientes.

### Java / Kotlin
- `HashMap` y `HashSet` para lookups O(1).
- `Stream` con collectors para agrupaciones.
- `StringBuilder` para concatenación en loops.
- Evitar boxing/unboxing innecesario (usar tipos primitivos cuando se pueda).

### TypeScript / JavaScript
- `Map` y `Set` (no objetos planos para colecciones grandes).
- `Array.reduce()` para construir Maps/Sets en una pasada.
- Evitar `.includes()` repetido → convertir a Set.

### Dart
- `Map<K, V>` para lookups.
- `Set<T>` para membership.
- `.toSet()` antes de buscar en una lista.

### .NET (C#)
- `Dictionary<TKey, TValue>` y `HashSet<T>`.
- `GroupBy()` una vez, no filtrar repetidamente.
- `StringBuilder` para concatenación.

---

## Cuándo Está Bien O(n²)

No todo O(n²) es un error. Es aceptable cuando:

- El dataset es **pequeño y fijo** (< 100 items) y no crecerá.
- Es un script de una sola ejecución (no un endpoint de API).
- La alternativa O(n) requiere tanta memoria que no es viable.
- Se documenta explícitamente: `// O(n²) aceptable: máximo 10 items`.

---

## Reglas para el Agente

1. **Antes de un loop anidado**, verificar si se puede resolver con un Set o Dict preprocesado.
2. **Nunca `.contains()` / `in lista` dentro de un loop**. Convertir a Set primero.
3. **Nunca query a BD dentro de un loop** (problema N+1). Usar batch queries.
4. **Si ordenas, hazlo una sola vez** afuera del loop.
5. **Usar la estructura de datos correcta** desde el inicio (no convertir después).
6. **String concatenation en loop** → usar el builder del lenguaje.
7. **Documentar** si deliberadamente se usa O(n²) con justificación.
8. **Generators / lazy evaluation** para datasets que podrían ser grandes.
9. **Medir antes de optimizar prematuramente** — pero nunca escribir O(n²) donde O(n) es trivial.
10. **Si detectas un anti-patrón de rendimiento en código existente**, sugerirlo al usuario antes de ignorarlo.
