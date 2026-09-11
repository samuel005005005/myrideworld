---
tipo: Catálogo y Reporte por Interfaz Gráfica
complejidad: Baja
---
# Gestión de Tarifas y Balances (Administrativo)

## 1. Objetivo
Permitir a los administradores de la Asociación configurar el tarifario estático y consultar los balances generados por los conductores para su liquidación externa.

## 2. Criterios de Aceptación
- Administrador puede definir pares de Origen-Destino con tarifa fija.
- Administrador puede ver reporte semanal de ingresos por conductor (Efectivo vs Tarjeta, Bruto vs Neto).

## 3. Flujo Enumerado
1. Administrador ingresa al Panel Web.
2. Administrador accede a módulo Tarifas.
3. Administrador crea/edita una tarifa (Origen, Destino, Precio) y la activa.
4. Administrador accede a módulo Balances.
5. Sistema consolida la información de la tabla `Pago y Balance` por Conductor en un periodo (ej. última semana).
6. Administrador exporta o revisa listado de conductores con:
   - Total Viajes.
   - Total Generado Efectivo.
   - Total Generado Tarjeta.
   - Total Neto (descontando fee).
7. La Asociación procede a pagar fuera del sistema (el MVP no incluye transferencia automática).

## 4. Modelos Asociados
- [Tarifa](../modelos-datos/md-tarifa.md)
- [Pago y Balance](../modelos-datos/md-pago-balance.md)
