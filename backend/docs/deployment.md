# Deployment

See [environment.md](./environment.md) for **frontend ↔ backend env vars** (Vercel + Render).

See also [backend/README.md](../README.md) for nginx/pm2 details.

## Architecture

| Service | Host | What users open |
|---------|------|-----------------|
| **Frontend** (Next.js) | Vercel | Your public website URL |
| **Backend** (Express API) | Render / VPS | API only — not the homepage |

`https://nehna.onrender.com` is the **API**. Visiting it in a browser will not show the NehnaX marketplace UI unless you deploy the frontend separately.

## Frontend — Vercel

1. Import repo; set **Root Directory** to `frontend`.
2. Env: `NEXT_PUBLIC_API_URL=https://nehna.onrender.com` (your Render API URL).
3. Build command: `npm run build` (builds `backend/shared` then Next.js).
4. Open your **Vercel URL** (e.g. `https://nehna.vercel.app`) — that is the website.

## Backend — Render

1. New **Web Service** → connect repo.
2. **Root Directory**: `backend`
3. **Runtime**: Docker (uses `backend/Dockerfile`) or Node:
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. **Environment** (required):
   - `NODE_ENV=production`
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — long random string (16+ chars)
   - `CORS_ORIGIN` — your Vercel frontend URL, e.g. `https://nehna.vercel.app`
   - `COOKIE_SECURE=true` (HTTPS)
5. Verify: `GET /health` → `{"ok":true,"env":"production"}` and `GET /` → API info JSON.

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
