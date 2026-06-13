# Contributing

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local Mongo for dev)

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed

cd ../frontend
npm install
cp .env.example .env.local
```

## Development

```bash
# Terminal 1 — API (:4000)
cd backend && npm run dev

# Terminal 2 — Web (:3000)
cd frontend && npm run dev
```

## Quality gates

```bash
cd backend && npm run typecheck && npm test
cd frontend && npm run typecheck && npm run lint
```

## Conventions

- Shared types/schemas live in `backend/shared` — never duplicate Zod rules in API or web.
- Frontend routes stay thin; domain UI in `frontend/src/features/`.
- API: routes → controllers → services → repositories.
