# Cola de Prompts

## En curso

_(Vacío)_

## Histórico

- 2026-09-12: Checkpoint tras migración `.agents`→`.cursor` + import QA/cola desde kiro-testing; WIP viaje/recibo.
- 2026-09-12 `#retoma`: Cerrado cableado E2E core loop.
  - Backend: `nuevoViajeDisponible` con payload completo; seed conductor aprobado+GPS; passwords `12345678`
  - Pasajero: recibo con tarifa/distancia/duración; navega en `viajeCompletado`; socket join diferido + auth token
  - Conductor: escucha `nuevoViajeDisponible`, `identificarConductor`, emite `actualizarUbicacion`, une sala del viaje
  - Tests rechazar/completar OK
  - Pendiente smoke manual: seed + apps + backend
