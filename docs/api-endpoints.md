# Stats Service — API Endpoints

Base URL: **`{STATS_SERVICE_URL}/api/v1/stats`**

All external endpoints use **Bearer** access token in `Authorization` header (unless otherwise documented).

---

## Error response format

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

## Player stats

### GET `/:userId`

Get player statistics for a user. **Auth: Bearer**

**Params:** `userId` — User ID (uuid)

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "userId": "uuid",
    "wins": number,
    "losses": number,
    "draws": number,
    "elo": number,
    "xp": number,
    "level": number,
    "updatedAt": "date-time"
  }
}
```

---

## Match history

### GET `/:userId/history`

Get match history for a user. **Auth: Bearer**

**Params:** `userId`

**Query:**

| Name  | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| page  | number | No       | Page number (default: 1) |
| limit | number | No       | Per page (default: 20, max: 100) |

**Success (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "playerAId": "uuid",
      "playerBId": "uuid or ai sentinel",
      "scoreA": number,
      "scoreB": number,
      "winnerId": "uuid" | null,
      "duration": number,
      "gameMode": "online" | "local" | "ai_easy" | "ai_medium" | "ai_hard",
      "playedAt": "date-time"
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

For AI matches, `playerBId` is a sentinel string (`"ai_easy"`, `"ai_medium"`, or `"ai_hard"`). When `winnerId` is `null` and `gameMode` starts with `ai_`, it means the AI won (not a draw).

---

## Leaderboard

### GET `/leaderboard`

Get leaderboard. **Auth: Bearer**

**Query:**

| Name   | Type   | Required | Description                    |
|--------|--------|----------|--------------------------------|
| limit  | number | No       | Number of players (default: 100, max: 1000) |
| offset | number | No       | Offset for pagination (default: 0) |

**Success (200):**

```json
{
  "status": "success",
  "data": [
    {
      "userId": "uuid",
      "wins": number,
      "losses": number,
      "draws": number,
      "elo": number,
      "xp": number,
      "level": number,
      "rank": number
    }
  ],
  "count": number
}
```

---

### GET `/leaderboard/rank/:userId`

Get a player's rank. **Auth: Bearer**

**Params:** `userId`

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "userId": "uuid",
    "elo": number,
    "rank": number
  }
}
```

---

## AI Match

### POST `/ai-match`

Record an AI match result. **Auth: Bearer**

AI matches do **not** affect ELO rating. They award XP based on game duration and track wins/losses.

**Body:**

```json
{
  "scoreA": number,
  "scoreB": number,
  "duration": number,
  "gameMode": "ai_easy" | "ai_medium" | "ai_hard"
}
```

| Field    | Type   | Required | Description                         |
|----------|--------|----------|-------------------------------------|
| scoreA   | number | Yes      | Player score (min: 0)               |
| scoreB   | number | Yes      | AI score (min: 0)                   |
| duration | number | Yes      | Game duration in seconds (min: 1)   |
| gameMode | string | Yes      | AI difficulty mode                  |

**Success (201):**

```json
{
  "status": "success",
  "message": "AI match recorded successfully",
  "data": {
    "id": "uuid",
    "playerAId": "uuid",
    "playerBId": "ai_easy",
    "scoreA": number,
    "scoreB": number,
    "winnerId": "uuid" | null,
    "duration": number,
    "gameMode": "ai_easy",
    "playedAt": "date-time"
  }
}
```

`winnerId` is the authenticated user's ID if they won (scoreA > scoreB), or `null` if the AI won. The `playerBId` is set to the `gameMode` value as a sentinel identifier.

---

## Internal API (backend only)

### POST `/internal/matches` (record match)

Record a match (e.g. from game-service). **Auth:** Service token (`x-service-token` header).

**Body:** Same as `RecordMatchDTO`, with optional `gameMode` field (defaults to `"online"`).

Not for frontend use.

---

### POST `/internal/init-stats` (initialize player stats)

Initialize player stats for a newly registered user so they appear in the leaderboard. Called by auth-service during registration. Uses `upsert` so it's safe to call multiple times. **Auth:** Service token (`x-service-token` header).

**Body:**

```json
{
  "userId": "uuid"
}
```

**Success (201):**

```json
{
  "status": "success",
  "message": "Player stats initialized successfully"
}
```

Not for frontend use.

---

## Summary

| Method | Path                        | Auth    | Purpose              |
|--------|-----------------------------|---------|----------------------|
| POST   | `/ai-match`                 | Bearer  | Record AI match      |
| GET    | `/:userId`                  | Bearer  | Player stats         |
| GET    | `/:userId/history`          | Bearer  | Match history        |
| GET    | `/leaderboard`              | Bearer  | Leaderboard          |
| GET    | `/leaderboard/rank/:userId` | Bearer  | Player rank          |
| POST   | `/internal/matches`         | Service | Record match (internal) |
| POST   | `/internal/init-stats`      | Service | Init player stats (internal) |

Route order: more specific first (`/ai-match`, `/leaderboard/rank/:userId`, `/leaderboard`, `/:userId/history`, `/:userId`).
