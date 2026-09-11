---
tipo: Consulta Operativa por Interfaz Gráfica
complejidad: Media
---
# Ejecución y Finalización del Viaje

## 1. Objetivo
Registrar la ejecución del viaje desde que el conductor va en camino hasta que finaliza y se realiza el pago, informando al pasajero en todo momento.

## 2. Criterios de Aceptación
- El conductor solo puede marcar "Llegué" si su GPS está en un radio cercano al origen.
- El conductor indica el inicio y fin del viaje.
- El pago en tarjeta descuenta el 7.5% de comisión.

## 3. Flujo Enumerado
1. Conductor se dirige al origen. Estado del viaje (opcional en UI conductor) -> `En camino`. Pasajero ve ubicación.
2. Conductor llega al origen y presiona "Llegué".
3. Sistema valida ubicación GPS vs OrigenLat/Lng (radio de tolerancia). Si es válido, Estado -> `Llegó`. Pasajero es notificado.
4. Pasajero aborda. Conductor presiona "Iniciar viaje". Estado -> `En curso`.
5. Conductor llega a destino. Presiona "Finalizar viaje" y selecciona método de pago.
6. Sistema registra pago.
   6.1. Si Tarjeta: `Fee = 7.5%`, `Neto = Bruto - Fee`.
   6.2. Si Efectivo: `Fee = 0`, `Neto = Bruto`.
7. Estado del viaje -> `Completado`.
8. Sistema actualiza balances del conductor.
9. Pasajero recibe pantalla para calificar al conductor.

## 4. Modelos Asociados
- [Viaje](../modelos-datos/md-viaje.md)
- [Pago y Balance](../modelos-datos/md-pago-balance.md)
