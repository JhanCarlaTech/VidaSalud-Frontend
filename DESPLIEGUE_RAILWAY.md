# Despliegue en Railway – Frontend

La guía completa (base de datos, API y frontend) está en el repo del backend:
[VidaSalud-Backend → DESPLIEGUE_RAILWAY.md](https://github.com/JhanCarlaTech/VidaSalud-Backend/blob/main/DESPLIEGUE_RAILWAY.md).

## Resumen de este servicio

- **Construcción:** el [`Dockerfile`](Dockerfile) compila la SPA con Node 22 (`npm ci` + `npm run build`). Después, Caddy sirve `dist/`.
- **Servidor:** el [`Caddyfile`](Caddyfile) hace dos cosas:
  - sirve la SPA y redirige cualquier ruta desconocida a `index.html`, para React Router;
  - reenvía `/api/*` y `/sanctum/*` al Backend. Así la SPA y la API comparten origen y la cookie de sesión de Sanctum funciona.
- **Caché:** los archivos con hash (`/assets/*`) se guardan un año; `index.html` nunca se guarda en caché.
- **Railway:** [`railway.json`](railway.json) usa el Dockerfile, con healthcheck en `/`.

## Variables

| Variable | Valor en Railway |
|---|---|
| `BACKEND_URL` | `http://${{Backend.RAILWAY_PRIVATE_DOMAIN}}:8080` |
| `PORT` | `8080` (fíjelo: es el puerto del dominio público) |

Genere el dominio público en *Settings → Networking → Generate Domain* (puerto 8080).
