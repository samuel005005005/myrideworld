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
  --dart-define=SOCKET_URL=https://api.ejemplo.com
```

En **debug** sin defines, `AppEnv` usa `10.0.2.2` (Android) o `127.0.0.1` (iOS/desktop).
