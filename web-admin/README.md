# MyRide Admin

Panel web fino sobre la API NestJS.

## Requisitos

- Backend corriendo con `ADMIN_EMAIL` / `ADMIN_PASSWORD` en `.env`
- `CORS_ORIGINS` debe incluir `http://127.0.0.1:5173` (o el origen de Vite)

## Arranque

```bash
cp .env.example .env
npm install
npm run dev
```

Login con las credenciales admin del backend.

## Pantallas

| Ruta | API |
|------|-----|
| `/login` | `POST /api/auth/login` (rol ADMIN) |
| `/configuracion` | `GET/PATCH /api/configuracion` |
| `/conductores` | `GET /api/conductores`, `PATCH …/aprobar` |
| `/viajes` | `GET /api/viajes` |
