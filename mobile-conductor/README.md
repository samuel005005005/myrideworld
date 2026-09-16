# MyRide — App Conductor

## Configuración de entorno

No se empaqueta `.env` en el binario.

```bash
cp .env.example .env
flutter pub get
flutter run --dart-define-from-file=.env
```

`API_BASE_URL` debe incluir el prefijo `/api`. También hace falta `OSRM_BASE_URL` (traza) y `NOMINATIM_BASE_URL` (direcciones de la oferta). Sin `--dart-define-from-file=.env` la app no arranca.

La ubicación es siempre GPS real del dispositivo (permisos + ubicación activada).

Release:

```bash
flutter build apk --dart-define-from-file=.env
```
