# MyRide — App Conductor

## Configuración de entorno

No se empaqueta `.env` en el binario.

```bash
cp .env.example .env
flutter pub get
flutter run --dart-define-from-file=.env
```

`API_BASE_URL` debe incluir el prefijo `/api` (ej. `http://10.0.2.2:3000/api`).

Release:

```bash
flutter build apk --dart-define-from-file=.env
```

En **debug** sin defines, `AppEnv` usa defaults de emulador/simulador.
