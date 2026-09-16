# Cola de Prompts

## En curso

- **Modo:** desarrollo
- **Hecho:**
  - Canal viaje: `unirseAViaje` emite `estadoViaje` (resync BD)
  - Sesión única: JWT `sid` + `SesionesActivasRegistry`; kick `sesionReemplazada`
  - Apps: escuchan resync + logout al kick
- **Falta:** reiniciar API + hot restart apps; probar 2 dispositivos mismo user + reconnect en viaje
- **Reanudar:** Validar sesión única y resync del room `viaje_{id}`

## Histórico

- 2026-09-16: Canal viaje + sesión 1 dispositivo; flota post-viaje; escala ofertas.
- 2026-09-15: Direcciones; cancel; flota; oferta al Conectado.
- 2026-09-12: Checkpoint `.agents`→`.cursor`.
