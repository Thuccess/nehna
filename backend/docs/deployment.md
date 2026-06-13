# Deployment

See also [backend/README.md](../backend/README.md) for nginx/pm2 details.

## Frontend — Vercel

1. Import repo; set **Root Directory** to `frontend`.
2. Env: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
3. Build command: `npm run build` (builds `backend/shared` then Next.js).
4. Add web origin to API `CORS_ORIGIN`.

## Backend — Hetzner VPS

1. Ubuntu 22.04, Node 20, pm2, nginx, Certbot.
2. Clone to `/var/www/nehnax`, `cd backend && npm install && npm run build`.
3. Configure `backend/.env` with production secrets.
4. `pm2 start dist/index.js --name nehnax-api --cwd backend`
5. nginx reverse proxy `api.yourdomain.com` → `127.0.0.1:4000`
6. `certbot --nginx -d api.yourdomain.com`

## Cloudflare R2

Set `R2_*` env vars on the API. Enable bucket CORS for PUT from web origin.

## MongoDB Atlas

- Whitelist VPS IP (or `0.0.0.0/0` for dev).
- Create Atlas Search indexes per [atlas-search.md](./atlas-search.md).
