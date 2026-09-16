# Deploy backend MyRide (VM)

Guía rápida para subir cambios del API NestJS a la VM de desarrollo.

| Campo | Valor |
|-------|--------|
| Host | `spaez@34.121.189.124` |
| Clave SSH | `~/.ssh/id_ed25519_triptaplatam` |
| Carpeta remota | `~/myride-backend/` |
| URL docs | `https://dev.triptapmedia.com:8444/api/docs` |

---

## Aliases (una vez por terminal)

```bash
tt_ssh() { ssh -i ~/.ssh/id_ed25519_triptaplatam "$@"; }
tt_rsync() { rsync -avz -e "ssh -i ~/.ssh/id_ed25519_triptaplatam" "$@"; }
TT_HOST='spaez@34.121.189.124'
```

---

## 1) Sync código desde el Mac

No pisa `.env` ni `docker-compose.prod.yml` de la VM.

```bash
cd /Users/spaez/Documents/Desarrollo/dev-ch/archivos/myride

tt_rsync --delete \
  --exclude node_modules \
  --exclude dist \
  --exclude .git \
  --exclude coverage \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude 'docker-compose.prod.yml' \
  backend/ "${TT_HOST}:~/myride-backend/"
```

---

## 2) Build y restart en la VM

```bash
tt_ssh "$TT_HOST"
cd ~/myride-backend
docker-compose -f docker-compose.prod.yml --env-file .env up -d --build
docker-compose -f docker-compose.prod.yml logs --tail=80 api
```

O en un solo comando (sin entrar interactivo):

```bash
tt_ssh "$TT_HOST" 'cd ~/myride-backend && docker-compose -f docker-compose.prod.yml --env-file .env up -d --build && docker-compose -f docker-compose.prod.yml logs --tail=80 api'
```

Confirmá que `myride_api` esté **Up** (no Restarting).

---

## 2b) Seed (claves nuevas de configuración)

Tras un deploy que agregue parámetros (ej. Cap Cana), corré seed **después** del `--build`. Usá `-T` (sin TTY) si lo lanzás por SSH:

```bash
tt_ssh "$TT_HOST" 'cd ~/myride-backend && docker-compose -f docker-compose.prod.yml --env-file .env exec -T api npm run seed'
```

En el log debe aparecer, si son nuevas:

- `Configuración creada: TARIFA_ZONA_CAP_CANA`
- `Configuración creada: GEOCERCA_CAP_CANA`

Si solo lista las viejas y salta de `TARIFA_MINIMA` a `SOPORTE_*`, la imagen aún no tiene el seeder nuevo → repetí rsync + `up -d --build`.

---

## 2c) FCM (timbre con app cerrada)

El JSON de **service account** (Admin SDK) vive en el Mac en:

`backend/secrets/firebase-adminsdk.json` (gitignored; no commitear).

Subirlo **aparte** del sync normal (el rsync del backend puede incluir `secrets/` si no lo excluís; el `.gitignore` solo evita el commit):

```bash
# Crear carpeta remota + sync del secreto (no va a git)
tt_ssh "$TT_HOST" 'mkdir -p ~/myride-backend/secrets'
tt_rsync backend/secrets/firebase-adminsdk.json \
  "${TT_HOST}:~/myride-backend/secrets/firebase-adminsdk.json"
```

En el `.env` de la VM (no se pisa con rsync):

```bash
GOOGLE_APPLICATION_CREDENTIALS=/app/secrets/firebase-adminsdk.json
```

Asegurate de que `docker-compose.prod.yml` monte el volumen, por ejemplo:

```yaml
volumes:
  - ./secrets:/app/secrets:ro
```

Luego `up -d` (o restart `api`). Log esperado: `FCM inicializado con GOOGLE_APPLICATION_CREDENTIALS`.

---

## 3) Smoke rápido (desde el Mac)

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://dev.triptapmedia.com:8444/api/docs
```

Esperado: `200` (o `301`/`302` si hay redirect; lo importante es que responda).

---

## Checklist

1. Aliases + `TT_HOST`
2. `tt_rsync` del `backend/`
3. `docker-compose ... up -d --build` en la VM
4. Seed si hay claves nuevas (`exec -T … npm run seed`)
5. Logs sin crash
6. Smoke a `/api/docs`
7. Hot restart de las apps móviles si el cambio las afecta
