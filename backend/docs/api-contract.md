# REST API Contract

Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`)

Auth: `Authorization: Bearer <token>` or HttpOnly cookie `adulis_token`.

| Method | Path | Auth | Notes |
| ------ | ---- | ---- | ----- |
| GET | `/health` | public | `{ ok: true, env }` |
| POST | `/auth/register` | public | Sets cookie |
| POST | `/auth/login` | public | Sets cookie |
| POST | `/auth/logout` | public | Clears cookie |
| GET | `/auth/me` | auth | Current user |
| GET | `/businesses` | optional | Filters: `category`, `neighborhood`, `q`, `status`, `ownerId` |
| GET | `/businesses/:id` | public | |
| POST | `/businesses` | seller/admin | Status `pending` |
| PATCH | `/businesses/:id` | owner/admin | Admin: `status`, `package` |
| DELETE | `/businesses/:id` | admin | |
| POST | `/businesses/:id/approve` | admin | |
| POST | `/businesses/:id/suspend` | admin | |
| GET | `/products` | public | Filters: `businessId`, `category`, `q`, `available` |
| GET | `/products/:id` | public | |
| POST | `/products` | seller/admin | Must own business |
| PATCH | `/products/:id` | owner/admin | |
| DELETE | `/products/:id` | owner/admin | |
| GET | `/inquiries` | seller/admin | |
| POST | `/inquiries` | public | |
| PATCH | `/inquiries/:id/read` | owner/admin | |
| GET | `/favorites` | auth | |
| POST | `/favorites` | auth | |
| DELETE | `/favorites/:itemType/:itemId` | auth | |
| GET | `/users` | admin | |
| PATCH | `/users/:id` | admin | |
| GET | `/search` | public | `q`, `type=business\|product` |
| POST | `/uploads/presign` | auth | R2 presigned PUT |

All errors: `{ error: string, details?: unknown }`.
