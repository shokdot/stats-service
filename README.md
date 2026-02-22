# Stats Service

> Part of the [ft_transcendence](https://github.com/shokdot/ft_transcendence) project.

Statistics and leaderboard microservice. Tracks player stats (wins, losses, draws, ELO, XP, level), match history, leaderboard, and player ranks. Also supports recording local AI matches. Internal API for game-service to record online match results.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify 5
- **ORM**: Prisma (SQLite)
- **Auth**: JWT Bearer (external), service token (internal)

## Quick Start

```bash
npm install
npm run dev
```

Service listens on `HOST:PORT` (default `0.0.0.0:3005`).

### Docker

Built from monorepo root; see project `Dockerfile` and `docker-compose*.yml`.

## Environment

| Variable             | Required | Description                      |
|----------------------|----------|----------------------------------|
| `PORT`               | No       | Server port (default: 3005)      |
| `HOST`               | No       | Bind address (default: 0.0.0.0)  |
| `SERVICE_TOKEN`      | Yes      | Service-to-service token         |
| `JWT_SECRET`         | Yes      | Access token verification        |
| `DATABASE_URL`       | Yes      | Database URL                     |

---

## API Endpoints

Base URL: **`{STATS_SERVICE_URL}/api/v1/stats`**

All external endpoints use **Bearer** access token in `Authorization` header.

### Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": null
  }
}
```

---

### Player Stats

#### `GET /:userId`

Get player statistics for a user. **Auth: Bearer**

**Params:** `userId` — User ID (uuid)

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "userId": "uuid",
    "wins": 10,
    "losses": 5,
    "draws": 1,
    "elo": 1100,
    "xp": 2400,
    "level": 5,
    "updatedAt": "date-time"
  }
}
```

---

### Match History

#### `GET /:userId/history`

Get paginated match history for a user. **Auth: Bearer**

**Params:** `userId`

**Query:**

| Name  | Type   | Required | Description                     |
|-------|--------|----------|---------------------------------|
| page  | number | No       | Page number (default: 1)        |
| limit | number | No       | Per page (default: 20, max: 100)|

**Success (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "playerAId": "uuid",
      "playerBId": "uuid or ai sentinel",
      "scoreA": 7,
      "scoreB": 3,
      "winnerId": "uuid",
      "duration": 120,
      "gameMode": "online",
      "playedAt": "date-time"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

> For AI matches, `playerBId` is a sentinel string (`"ai_easy"`, `"ai_medium"`, `"ai_hard"`). `winnerId: null` on an AI match means the AI won (not a draw).

---

### Leaderboard

#### `GET /leaderboard`

Get the global leaderboard. **Auth: Bearer**

**Query:**

| Name   | Type   | Required | Description                          |
|--------|--------|----------|--------------------------------------|
| limit  | number | No       | Number of entries (default: 100, max: 1000)|
| offset | number | No       | Pagination offset (default: 0)       |

**Success (200):**

```json
{
  "status": "success",
  "data": [
    {
      "userId": "uuid",
      "wins": 10,
      "losses": 2,
      "draws": 0,
      "elo": 1200,
      "xp": 3000,
      "level": 6,
      "rank": 1
    }
  ],
  "count": 100
}
```

---

#### `GET /leaderboard/rank/:userId`

Get a specific player's rank. **Auth: Bearer**

**Params:** `userId`

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "userId": "uuid",
    "elo": 1100,
    "rank": 15
  }
}
```

---

### AI Match

#### `POST /ai-match`

Record the result of a local AI match. **Auth: Bearer**

> AI matches do **not** affect ELO. They award XP based on duration and track wins/losses.

**Body:**

| Field    | Type   | Required | Description                        |
|----------|--------|----------|------------------------------------|
| scoreA   | number | Yes      | Player score (min: 0)              |
| scoreB   | number | Yes      | AI score (min: 0)                  |
| duration | number | Yes      | Game duration in seconds (min: 1)  |
| gameMode | string | Yes      | `"ai_easy"` \| `"ai_medium"` \| `"ai_hard"` |

**Success (201):**

```json
{
  "status": "success",
  "message": "AI match recorded successfully",
  "data": {
    "id": "uuid",
    "playerAId": "uuid",
    "playerBId": "ai_easy",
    "scoreA": 7,
    "scoreB": 3,
    "winnerId": "uuid",
    "duration": 120,
    "gameMode": "ai_easy",
    "playedAt": "date-time"
  }
}
```

`winnerId` is the authenticated user if `scoreA > scoreB`, otherwise `null` (AI won).

---

### Internal API (backend only)

**Auth:** Service token (`x-service-token` header). Not for frontend use.

#### `POST /internal/matches`

Record an online match result (called by game-service). Body follows `RecordMatchDTO` (optional `gameMode`, defaults to `"online"`).

#### `POST /internal/init-stats`

Initialize player stats for a new user (called by auth-service on registration). Safe to call multiple times (upsert).

**Body:** `{ "userId": "uuid" }`

**Success (201):** `{ "status": "success", "message": "Player stats initialized successfully" }`

---

### Summary

| Method | Path                        | Auth    | Purpose                     |
|--------|-----------------------------|---------|-----------------------------|
| POST   | `/ai-match`                 | Bearer  | Record AI match             |
| GET    | `/:userId`                  | Bearer  | Get player stats            |
| GET    | `/:userId/history`          | Bearer  | Get match history           |
| GET    | `/leaderboard`              | Bearer  | Global leaderboard          |
| GET    | `/leaderboard/rank/:userId` | Bearer  | Get player rank             |
| POST   | `/internal/matches`         | Service | Record match (internal)     |
| POST   | `/internal/init-stats`      | Service | Init player stats (internal)|
