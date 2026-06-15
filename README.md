# Nehna — Eritrean Marketplace, Kampala

Two standalone apps — **no root `package.json` or workspace**. Install and run each folder separately.

| Folder | Stack | Dev URL |
|--------|-------|---------|
| [`frontend/`](frontend/) | Next.js 15 | http://localhost:3000 |
| [`backend/`](backend/) | Express 5 + MongoDB | http://localhost:4000 |

Shared types: [`backend/shared/`](backend/shared/) (`@adulis/shared`).

If you still have a root `node_modules/` from an old workspace setup, stop any running dev servers and delete that folder.

## Quick start

```bash
# API
cd backend
cp .env.example .env    # fill in MongoDB URI, JWT secret, etc.
npm install
npm run dev:db          # optional local Mongo
npm run seed
npm run dev

# Web (separate terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Docs: [`backend/docs/`](backend/docs/)
