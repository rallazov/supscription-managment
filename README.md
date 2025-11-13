
# Subscription Management API

A minimal Express + TypeScript API for managing newsletter subscriptions.

## Requirements

- Node.js 18+
- PostgreSQL 13+

## Quick start

1) Clone and install

```bash
git clone https://github.com/rallazov/supscription-managment
cd supscription-managment
npm ci
```

2) Configure environment

```bash
cp .env.example .env
# Update values as needed (DB_*, PORT)
```

3) Run

```bash
# Dev (ts-node)
npm run dev

# or Prod (build + start)
npm run build && npm start
```

Server listens on `http://localhost:${PORT}` (defaults to 5000).

## Environment variables

See `.env.example` for the full list. Key values:

- `PORT` – API port (default 5000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` – PostgreSQL connection
- `CORS_ORIGIN` – Comma-separated list of allowed origins (e.g. `http://localhost:5173,https://yourdomain.com`)

## Routes

Base path: `/api`

- POST `/api/subscribe`
  - Body: `{ "email": "user@example.com" }`
  - Responses: `201 Created` on success, `409 Conflict` if email exists

- GET `/api/subscriptions`
  - Returns all subscriptions. Note: service implementation is currently a stub.

Root health:

- GET `/` → `"Welcome to the Subscription Management API"`
- GET `/healthz` → `{ status: 'ok', db: 'ok' }` when DB reachable

## Database

The app tests the DB connection on startup. Ensure your database is reachable using the credentials in `.env` and that a `subscribers` table exists with columns `(id serial pk, email text unique, subscriptionDate timestamp, status text)`.

Example SQL:

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscriptionDate TIMESTAMP NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);
```

## API documentation (Swagger/OpenAPI)

Swagger is not yet configured in this repository. If you want, we can add `swagger-ui-express` + `swagger-jsdoc` and expose docs at `/api-docs`.

---

MIT License

