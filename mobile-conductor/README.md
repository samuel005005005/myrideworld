# MyRide — App Conductor

## Configuración de entorno

No se empaqueta `.env` en el binario.

```bash
cp .env.example .env
flutter pub get
flutter run --dart-define-from-file=.env
```

`API_BASE_URL` debe incluir el prefijo `/api`. También hace falta `OSRM_BASE_URL` (traza) y `NOMINATIM_BASE_URL` (direcciones de la oferta). Sin `--dart-define-from-file=.env` la app no arranca.

En debug, `GPS_OVERRIDE_LAT` / `GPS_OVERRIDE_LNG` en `.env` sustituyen el GPS del teléfono (mismo flujo PATCH/API). En release se ignoran.

Release:

```bash
flutter build apk --dart-define-from-file=.env
```
