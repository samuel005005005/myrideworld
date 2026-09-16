---
tipo: Solicitud por Interfaz Gráfica
complejidad: Alta
---
# Solicitar y Asignar Viaje

## 1. Objetivo
Permitir que un pasajero solicite un viaje y el sistema oferte en paralelo a los conductores cercanos activos; el primero que acepta queda asignado.

## 2. Criterios de Aceptación
- El pasajero debe visualizar la tarifa fija antes de confirmar.
- Si origen y destino están dentro de Cap Cana, la tarifa mostrada es la plana de zona (configurable; seed USD 4).
- Si el viaje no es interno Cap Cana, aplica tarifario OD o fórmula base+km.
- El sistema debe buscar conductores en estado `Conectado`, con GPS de flota activo (heartbeat) y cercanos al origen.
- Se ofrece el viaje **en paralelo** a los **N más cercanos** del radio (`MAX_CONDUCTORES_OFERTA_PARALELA`, seed 5), no a toda la flota.
- Radio de asignación configurable (`RADIO_ASIGNACION_KM`, seed 15 km).
- El primero que acepta se asigna; al resto se cancela la oferta.
- Si un conductor rechaza o expira su tiempo, se retira solo su oferta; si no queda nadie sonando, se busca de nuevo o se marca sin conductor.

## 3. Flujo Enumerado
1. Pasajero selecciona Origen y Destino en la App.
2. Sistema calcula distancia y determina la tarifa (Cap Cana plana → OD → fórmula).
3. Pasajero confirma solicitud. Estado del viaje -> `Solicitado`.
4. Sistema busca lista de conductores candidatos (radio cercano + flota activa).
5. Sistema filtra y ordena por distancia. Estado del viaje -> `Buscando conductor`.
6. Se notifica en paralelo a los N candidatos más cercanos. Cada uno tiene temporizador de espera (ej. 30s).
7. Si un Conductor acepta:
   7.1. Se asigna `ConductorId` al Viaje.
   7.2. Estado del viaje -> `Conductor asignado`.
   7.3. Se cancela la oferta al resto de candidatos.
   7.4. Pasajero recibe info del conductor. Fin del flujo.
8. Si un Conductor rechaza o expira tiempo:
   8.1. Se retira su oferta; los demás siguen sonando.
   8.2. Si ya no queda ninguna oferta activa, se busca de nuevo candidatos no rechazados (paso 4) o se pasa a sin conductor.
9. Si se agotan los candidatos:
   9.1. Estado del viaje -> `Sin conductor disponible`.
   9.2. Pasajero es notificado. Fin del flujo.

## 4. Modelos Asociados
- [Viaje](../modelos-datos/md-viaje.md)
- [Conductor](../modelos-datos/md-conductor.md)
- [Pasajero](../modelos-datos/md-pasajero.md)
