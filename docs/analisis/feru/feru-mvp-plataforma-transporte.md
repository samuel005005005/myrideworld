# FERU: Plataforma Transporte Punta Cana MVP

## 1. Interpretación de la Necesidad
La Asociación de Taxis en Punta Cana necesita digitalizar su operación para competir y mejorar el servicio a turistas. El MVP busca conectar directamente a pasajeros con conductores mediante una app móvil, eliminando intermediarios telefónicos o físicos. La prioridad es la velocidad de lanzamiento (time-to-market), por lo que se ha descartado inicialmente cualquier funcionalidad compleja como tarifas dinámicas, reservas o penalidades automáticas.

## 2. Contribuciones del Analista
- **Estados del Viaje:** Se formalizó la máquina de estados del viaje (Solicitado -> Buscando -> Asignado -> En camino -> Llegó -> En curso -> Completado) para evitar ambigüedades en la implementación móvil.
- **Asignación Concurrente:** Se detectó la necesidad de definir claramente el proceso de "sistema escalonado" para evitar que dos conductores reciban o acepten el mismo viaje simultáneamente. Se recomienda usar locks o transacciones a nivel de base de datos durante la aceptación.
- **Pagos Mixtos:** Se aclaró que la lógica de cobro de comisión del 7.5% aplica exclusivamente al flujo de pago electrónico, mientras que el efectivo se suma neto al conductor (o a descontar de su deuda si la app cobra fee general, aunque en el MVP solo se menciona el fee por procesamiento).

## 3. Análisis de Impacto
| Componente | Tipo de Impacto | Descripción |
|------------|-----------------|-------------|
| Arquitectura | Alto | Requiere servicios de tiempo real (WebSockets/SSE) para tracking GPS y notificaciones. |
| Base de Datos | Alto | Modelado de entidades georreferenciadas (PostGIS u homologo) para búsqueda por radio. |
| Pagos | Medio | Integración con pasarela externa; no guardar datos de TC en base propia (PCI Compliance simplificado). |
