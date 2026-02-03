# Stats Service

Statistics and leaderboard microservice for the ft_transcendence platform. Handles player stats (wins, losses, draws, ELO, XP, level), match history, leaderboard, and rank. Internal API for recording matches (game-service).

## Features

- **External API**: Player stats, match history, leaderboard, player rank (Bearer auth)
- **Internal API**: Record match (service token)

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify 5
- **ORM**: Prisma (SQLite)
- **Auth**: JWT Bearer (external), service token (internal)

## Quick Start

### Prerequisites

- Node.js 20+
- Environment variables (see [Environment](#environment))

### Install & Run

```bash
npm install
npm run dev
```

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm start` (production)

Service listens on `HOST:PORT` (default `0.0.0.0:3005`).

### Docker

Built from monorepo root; see project `Dockerfile` and `docker-compose*.yml`.

## Environment

| Variable                | Required | Description                    |
|-------------------------|----------|--------------------------------|
| `PORT`                  | No       | Server port (default: 3005)    |
| `HOST`                  | No       | Bind address (default: 0.0.0.0)|
| `SERVICE_TOKEN`         | Yes      | Service-to-service token       |
| `JWT_SECRET`            | Yes      | Access token verification     |
| `JWT_REFRESH_SECRET`    | Yes      | Refresh token (if needed)     |
| `JWT_TWO_FA`            | Yes      | 2FA token (if needed)          |
| `DATABASE_URL`          | Yes      | Database URL                   |

API prefix defaults to `/api/v1` (from core).

## API Base URL

All stats routes are under:

```
{baseUrl}/api/v1/stats
```

- **External (frontend):** `GET /:userId`, `GET /:userId/history`, `GET /leaderboard`, `GET /leaderboard/rank/:userId`
- **Internal:** `POST /internal/...` (record match; service token)

## Documentation

- **[API Endpoints](docs/api-endpoints.md)** — Full list of endpoints, request/response bodies, errors.
- **[Frontend Integration Guide](docs/frontend-integration-guide.md)** — Flows and usage from React/Next.js.

## Project Structure

```
src/
├── controllers/   # external (stats, history, leaderboard, rank), internal (recordMatch)
├── services/      # Business logic, ELO
├── routes/        # external + internal
├── schemas/       # Validation
├── dto/           # Data transfer types
└── utils/         # env, prisma
prisma/
└── schema.prisma
```

## License

Part of ft_transcendence project.
