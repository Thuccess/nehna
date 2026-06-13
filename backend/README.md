# Adulis API

Express 5 + TypeScript backend powering the Adulis marketplace. Persists data in MongoDB Atlas, serves a typed JSON REST API, signs Cloudflare R2 uploads, and exposes MongoDB Atlas Search for fuzzy listing search.

## Local development

1. `cp .env.example .env` and fill in the values (Atlas URI, JWT secret, R2 creds).
2. `npm install` in this `backend/` folder.
3. `npm run dev:db` for optional local Mongo (`docker-compose.yml` in this folder).
4. `npm run seed` to populate the demo dataset.
5. `npm run dev` — API on `http://localhost:4000`.

Shared types/schemas: `backend/shared/` (`@adulis/shared`). Built automatically via `npm run build:shared`.

## REST endpoints

| Method | Path                              | Auth        | Notes                                          |
| ------ | --------------------------------- | ----------- | ---------------------------------------------- |
| POST   | `/auth/register`                  | public      | Creates user, sets HttpOnly `adulis_token`     |
| POST   | `/auth/login`                     | public      | Same cookie                                    |
| POST   | `/auth/logout`                    | public      | Clears cookie                                  |
| GET    | `/auth/me`                        | bearer/cookie | Returns current user                         |
| GET    | `/businesses`                     | optional    | Filters: `category`, `neighborhood`, `q`, `status` |
| GET    | `/businesses/:id`                 | public      |                                                |
| POST   | `/businesses`                     | seller/admin| Creates business in `pending` state            |
| PATCH  | `/businesses/:id`                 | owner/admin | Admin-only fields: `status`, `package`         |
| DELETE | `/businesses/:id`                 | admin       |                                                |
| POST   | `/businesses/:id/approve|suspend` | admin       | Convenience admin actions                      |
| GET    | `/products`                       | public      | Filters: `businessId`, `category`, `q`, `available` |
| POST   | `/products`                       | seller/admin| Must own the target business                   |
| PATCH  | `/products/:id`                   | owner/admin |                                                |
| DELETE | `/products/:id`                   | owner/admin |                                                |
| GET    | `/inquiries`                      | seller/admin| Sellers see their own business inquiries       |
| POST   | `/inquiries`                      | public      | Customer/buyer submission                      |
| PATCH  | `/inquiries/:id/read`             | owner/admin |                                                |
| GET    | `/favorites`                      | auth        |                                                |
| POST   | `/favorites`                      | auth        |                                                |
| DELETE | `/favorites/:itemType/:itemId`    | auth        |                                                |
| GET    | `/users`                          | admin       | Admin user list                                |
| PATCH  | `/users/:id`                      | admin       | Ban/activate, change role                      |
| GET    | `/search`                         | public      | Query: `q`, `type=business\|product`           |
| POST   | `/uploads/presign`                | auth        | Returns R2 presigned PUT + public URL          |

Auth is dual-mode: pass `Authorization: Bearer <token>` from native API consumers, or rely on the HttpOnly `adulis_token` cookie from the Next.js front-end.

## MongoDB Atlas Search indexes

Create two Atlas Search indexes in the Atlas UI (or with `mongosh`):

### `businesses_search` on the `businesses` collection

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name":         { "type": "string", "analyzer": "lucene.english" },
      "description":  { "type": "string", "analyzer": "lucene.english" },
      "category":     { "type": "string" },
      "neighborhood": { "type": "string" },
      "address":      { "type": "string" },
      "status":       { "type": "token" }
    }
  }
}
```

### `products_search` on the `products` collection

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name":        { "type": "string", "analyzer": "lucene.english" },
      "description": { "type": "string", "analyzer": "lucene.english" },
      "category":    { "type": "string" }
    }
  }
}
```

If neither index exists, `/search` automatically falls back to a regex query, so the API stays functional on a fresh cluster.

## Cloudflare R2 setup

1. Create a bucket (default name `adulis-media`).
2. Create an API token with **Object Read & Write** for the bucket; capture `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`.
3. Note your `R2_ACCOUNT_ID` (Cloudflare dashboard sidebar).
4. Either enable the `pub-*.r2.dev` public URL or attach a custom domain - set `R2_PUBLIC_BASE_URL` to that origin (no trailing slash).
5. Optional - set the bucket CORS to allow PUT from the web origin:

```json
[
  {
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["https://adulis.example", "http://localhost:3000"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Hetzner VPS deployment

Tested on Ubuntu 22.04 with a CX22 instance.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# App
git clone <repo> /var/www/adulis
cd /var/www/adulis
npm ci
npm run build:shared
npm run build:api
cp backend/.env.example backend/.env   # then edit values
pm2 start backend/dist/index.js --name adulis-api --cwd backend
pm2 save
pm2 startup systemd -u $USER --hp $HOME
```

### nginx reverse proxy (`/etc/nginx/sites-available/adulis-api`)

```nginx
server {
  listen 80;
  server_name api.adulis.example;

  client_max_body_size 5m;

  location / {
    proxy_pass         http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/adulis-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# TLS
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.adulis.example
```

After TLS is provisioned, set `COOKIE_SECURE=true` (and `CORS_ORIGIN=https://adulis.example`) in `.env`, then `pm2 restart adulis-api`.

## Docker (optional)

```bash
docker build -t adulis-api -f backend/Dockerfile .
docker run --env-file backend/.env -p 4000:4000 adulis-api
```
