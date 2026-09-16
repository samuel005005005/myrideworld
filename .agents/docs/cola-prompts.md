# Cola de Prompts

## En curso

- **Modo:** desarrollo
- **Hecho:**
  - Tarifa plana Cap Cana: `TARIFA_ZONA_CAP_CANA` + `GEOCERCA_CAP_CANA` (seed bbox)
  - Estimar prioriza Cap Cana → OD → fórmula; mixtos usan tarifario
  - Admin FINANZAS ve/edita ambas claves; tests OK
- **Falta:** redeploy API + seed en VM para insertar las 2 claves nuevas
- **Reanudar:** Deploy backend y verificar estimar interno Cap Cana = 4 USD

## Histórico

- 2026-09-16: Análisis Cap Cana; deploy guide; lista ofertas conductor.
- 2026-09-15: Direcciones origen oferta; cancel post-aceptación; flota; oferta al Conectado.
- 2026-09-12: Checkpoint tras migración `.agents`→`.cursor`.
