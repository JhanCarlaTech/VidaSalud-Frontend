# syntax=docker/dockerfile:1
#
# Frontend de Clínica Vida Salud (React + Vite) para producción.
# 1) Node compila la SPA. 2) Caddy la sirve y reenvía /api y /sanctum a la API,
#    igual que el proxy de Vite en desarrollo: SPA y API comparten origen, así la
#    cookie de sesión de Sanctum funciona sin CORS ni cookies de terceros.

FROM node:22-alpine AS compilacion
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=compilacion /app/dist /srv

ENV PORT=8080
EXPOSE 8080
# La imagen de Caddy ya arranca con: caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
