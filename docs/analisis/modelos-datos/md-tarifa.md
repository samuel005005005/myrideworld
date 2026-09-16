# Modelo de Datos: Tarifa

Tarifario **Origen–Destino** (viajes fuera de Cap Cana o mixtos). Complementa la tarifa plana de zona Cap Cana en configuración (`TARIFA_ZONA_CAP_CANA` + geocerca). Ver BR-TAR-001..003 en [req-mvp](../requerimientos/req-mvp-plataforma-transporte.md).

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|----------|-------------|-------------|
| Id | Guid | Sí | PK | Identificador |
| Origen | string | Sí | | Nombre/Polígono del origen |
| Destino | string | Sí | | Nombre/Polígono del destino |
| Precio | decimal | Sí | > 0 | Precio fijo |
| Estado | string | Sí | Activo/Inactivo | Si está vigente |

## Parámetros de configuración asociados

| Clave | Tipo | Seed / default negocio | Descripción |
|-------|------|------------------------|-------------|
| `TARIFA_ZONA_CAP_CANA` | decimal USD | `4` | Precio fijo si origen y destino ∈ geocerca Cap Cana |
| `GEOCERCA_CAP_CANA` | JSON bbox | Ver abajo | Límite editable en Admin (“dentro de Cap Cana”) |
| `TARIFA_BASE` / `TARIFA_KM` / `TARIFA_MINIMA` | decimal | Ya existentes | Fallback fuera de Cap Cana sin par OD |

### Seed bbox Cap Cana (aproximado, ajustable en Admin)

No es un límite oficial del master plan; sirve para arrancar y la asociación lo corrige en panel.

```json
{
  "tipo": "bbox",
  "latMin": 18.45,
  "latMax": 18.53,
  "lngMin": -68.48,
  "lngMax": -68.35
}
```

Punto dentro = `latMin ≤ lat ≤ latMax` y `lngMin ≤ lng ≤ lngMax`.

## Prioridad al estimar

1. Ambos puntos dentro Cap Cana → `TARIFA_ZONA_CAP_CANA`
2. Par OD activo → precio OD
3. Fórmula base + km (mínimo)

## Decisiones cerradas

| Tema | Decisión |
|------|----------|
| Viajes mixtos / fuera | Tarifario OD → fórmula |
| Geocerca | Definida y editada en Admin; seed bbox aproximado |
