---
tipo: Solicitud por Interfaz Gráfica
complejidad: Alta
---
# Solicitar y Asignar Viaje

## 1. Objetivo
Permitir que un pasajero solicite un viaje y el sistema asigne automáticamente al conductor disponible más cercano mediante un mecanismo escalonado.

## 2. Criterios de Aceptación
- El pasajero debe visualizar la tarifa fija antes de confirmar.
- El sistema debe buscar conductores en estado `Conectado` y `Disponible` cerca del origen.
- Se debe ofrecer a un conductor a la vez (escalonado).
- Si el conductor rechaza o el tiempo de espera expira, pasa al siguiente.

## 3. Flujo Enumerado
1. Pasajero selecciona Origen y Destino en la App.
2. Sistema calcula distancia y recupera la Tarifa fija.
3. Pasajero confirma solicitud. Estado del viaje -> `Solicitado`.
4. Sistema busca lista de conductores candidatos (radio cercano).
5. Sistema filtra y ordena por distancia (más cercano primero). Estado del viaje -> `Buscando conductor`.
6. Se notifica al Conductor 1. Inicia temporizador de espera (ej. 30s).
7. Si Conductor 1 acepta:
   7.1. Se asigna `ConductorId` al Viaje.
   7.2. Estado del viaje -> `Conductor asignado`.
   7.3. Pasajero recibe info del conductor. Fin del flujo.
8. Si Conductor 1 rechaza o expira tiempo:
   8.1. Se notifica al Conductor 2. Repite paso 6.
9. Si se agotan los candidatos:
   9.1. Estado del viaje -> `Sin conductor disponible`.
   9.2. Pasajero es notificado. Fin del flujo.

## 4. Modelos Asociados
- [Viaje](../modelos-datos/md-viaje.md)
- [Conductor](../modelos-datos/md-conductor.md)
- [Pasajero](../modelos-datos/md-pasajero.md)
