# Nehna Web (frontend)

Next.js 15 App Router marketplace UI.

## Setup

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                  # http://localhost:3000
```

`npm run dev` builds [`../backend/shared`](../backend/shared) first (types/schemas used by the app).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |

Deploy on Vercel with **Root Directory** = `frontend`. Ensure `backend/shared` is built before `next build` (the `build` script does this automatically).
