# MyRide — App Pasajero

## Configuración de entorno

No se empaqueta `.env` en el binario.

```bash
cp .env.example .env
flutter pub get
flutter run --dart-define-from-file=.env
```

Release:

```bash
flutter build apk --dart-define-from-file=.env
# o defines explícitos:
flutter build apk \
  --dart-define=API_BASE_URL=https://api.ejemplo.com \
  --dart-define=SOCKET_URL=https://api.ejemplo.com \
  --dart-define=OSRM_BASE_URL=https://router.project-osrm.org
```

Sin `--dart-define-from-file=.env` (o defines equivalentes) la app no arranca.
