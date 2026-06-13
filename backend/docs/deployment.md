# Deployment

See also [backend/README.md](../README.md) for nginx/pm2 details.

## Architecture

| Service | Host | What users open |
|---------|------|-----------------|
| **Frontend** (Next.js) | Vercel | Your public website URL |
| **Backend** (Express API) | Render / VPS | API only — not the homepage |

`https://nehna.onrender.com` is the **API**. Visiting it in a browser will not show the NehnaX marketplace UI unless you deploy the frontend separately.

## Connect Vercel frontend + Render API

| Dashboard | Variable | Value |
|-----------|----------|-------|
| **Vercel** → Settings → Environment Variables | `NEXT_PUBLIC_API_URL` | `https://nehna.onrender.com` |
| **Render** → Environment | `CORS_ORIGIN` | `https://nehna-two.vercel.app` |
| **Render** → Environment | `COOKIE_SECURE` | `true` |
| **Render** → Environment | `COOKIE_DOMAIN` | *(leave empty)* |
| **Render** → Environment | `NODE_ENV` | `production` |

After changing Vercel env vars, **Redeploy** the frontend (Deployments → Redeploy). Render redeploys automatically when env changes are saved.

**Verify**

1. [https://nehna.onrender.com/health](https://nehna.onrender.com/health) → `{"ok":true,"env":"production"}`
2. Open [https://nehna-two.vercel.app/](https://nehna-two.vercel.app/) — listings should load (not stuck at 0 if DB has data).
3. Sign in — if CORS/cookies are wrong, the browser console shows blocked requests or 401 on `/auth/me`.

**Local dev + production:** set Render `CORS_ORIGIN` to both origins (comma-separated, no spaces after commas):

`https://nehna-two.vercel.app,http://localhost:3000`

## Frontend — Vercel

1. Import repo; set **Root Directory** to `frontend`.
2. Env: `NEXT_PUBLIC_API_URL=https://nehna.onrender.com`
3. Build command: `npm run build` (builds `backend/shared` then Next.js).
4. Website URL: [https://nehna-two.vercel.app/](https://nehna-two.vercel.app/)

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
   - `CORS_ORIGIN` — `https://nehna-two.vercel.app`
   - `COOKIE_SECURE=true`
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
