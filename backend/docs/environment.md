# Environment variables — connecting frontend and backend

## How they link

```
Browser (Vercel)                    Render API
https://your-app.vercel.app  ──►   https://nehna.onrender.com
        │                                    │
        │  NEXT_PUBLIC_API_URL               │  CORS_ORIGIN
        │  points here ───────────────────────►│  must list Vercel URL
        │                                    │
        │  fetch(..., credentials: include)  │  COOKIE_SECURE=true
        └────────────────────────────────────┘  (auth cookie, SameSite=None)
```

| Frontend (Vercel) | Backend (Render) | Why |
|-------------------|------------------|-----|
| `NEXT_PUBLIC_API_URL=https://nehna.onrender.com` | — | Browser knows where to send API requests |
| — | `CORS_ORIGIN=https://your-app.vercel.app` | API allows requests from your site |
| — | `COOKIE_SECURE=true` | Required for cross-site cookies over HTTPS |
| — | `COOKIE_DOMAIN=` (empty) | API and site are on different domains |
| — | `NODE_ENV=production` | Production logging and behavior |
| — | `MONGODB_URI`, `JWT_SECRET` | Required for API to run |

`NEXT_PUBLIC_*` variables are baked in at **build time** on Vercel. After changing them, redeploy the frontend.

## Render (backend)

Dashboard → your web service → **Environment**:

| Variable | Example value |
|----------|----------------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | long random string (16+ chars) |
| `CORS_ORIGIN` | `https://nehna.vercel.app` |
| `COOKIE_SECURE` | `true` |
| `COOKIE_DOMAIN` | leave unset / empty |
| `JWT_EXPIRES_IN` | `7d` (optional) |

Multiple Vercel URLs (production + preview):

```text
CORS_ORIGIN=https://nehna.vercel.app,https://nehna-git-main-yourname.vercel.app
```

Save → **Manual Deploy** (or wait for auto-deploy).

**Check:** `https://nehna.onrender.com/health` → `{"ok":true,"env":"production"}`

## Vercel (frontend)

Dashboard → Project → **Settings** → **Environment Variables**:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://nehna.onrender.com` | Production, Preview, Development |

Redeploy after adding or changing variables.

**Check:** open your Vercel site → DevTools → Network → any API call should go to `nehna.onrender.com`, not `localhost:4000`.

## Local development

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**`backend/.env`**

```env
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
COOKIE_SECURE=false
MONGODB_URI=mongodb://127.0.0.1:27017/adulis
JWT_SECRET=local-dev-secret-min-16-chars
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| API calls go to `localhost:4000` on Vercel | Set `NEXT_PUBLIC_API_URL` and **redeploy** |
| CORS error in browser console | Add exact Vercel URL to `CORS_ORIGIN` (no trailing slash) |
| Login works once then session lost | `COOKIE_SECURE=true` on Render; `CORS_ORIGIN` must match site URL |
| 401 on `/auth/me` after login | Same cookie/CORS issues; check Network tab for cookie on API responses |
| Render health shows `env: development` | Set `NODE_ENV=production` on Render |
