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
      "playerBId": "uuid",
      "scoreA": number,
      "scoreB": number,
      "winnerId": "uuid" | null,
      "duration": number,
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

## Internal API (backend only)

### POST `/internal/...` (record match)

Record a match (e.g. from game-service). **Auth:** Service token. Body and response are service-specific. Not for frontend.

---

## Summary

| Method | Path                     | Auth   | Purpose           |
|--------|--------------------------|--------|-------------------|
| GET    | `/:userId`               | Bearer | Player stats      |
| GET    | `/:userId/history`       | Bearer | Match history     |
| GET    | `/leaderboard`           | Bearer | Leaderboard       |
| GET    | `/leaderboard/rank/:userId` | Bearer | Player rank   |

Route order: more specific first (`/leaderboard/rank/:userId`, `/leaderboard`, `/:userId/history`, `/:userId`).
