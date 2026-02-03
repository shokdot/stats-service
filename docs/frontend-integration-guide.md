# Frontend Integration Guide — Stats Service

How a **React/Next.js** frontend should use the Stats Service: flows, requests, and patterns.

---

## Base URL and auth

- **Base URL**: `{STATS_SERVICE_URL}/api/v1/stats`
- **Auth**: Send access token (from Auth Service) as `Authorization: Bearer <accessToken>` on every request.

---

## 1. Player stats

**Purpose:** Show a user's stats (wins, losses, draws, ELO, XP, level).

**Request:** `GET /api/v1/stats/:userId`

**Flow:** Call with Bearer token; render `data` (userId, wins, losses, draws, elo, xp, level, updatedAt). Use for profile or game summary.

---

## 2. Match history

**Purpose:** Show a user's past matches (paginated).

**Request:** `GET /api/v1/stats/:userId/history?page=1&limit=20`

**Flow:** Call with Bearer token; render `data` array (id, playerAId, playerBId, scoreA, scoreB, winnerId, duration, playedAt). Use `pagination` for next/prev page.

---

## 3. Leaderboard

**Purpose:** Show ranked list of players.

**Request:** `GET /api/v1/stats/leaderboard?limit=100&offset=0`

**Flow:** Call with Bearer token; render `data` array (userId, wins, losses, draws, elo, xp, level, rank). Use `count` for total.

---

## 4. Player rank

**Purpose:** Show a single user's rank and ELO.

**Request:** `GET /api/v1/stats/leaderboard/rank/:userId`

**Flow:** Call with Bearer token; render `data` (userId, elo, rank). Use on profile or after a game.

---

## Quick reference

| User action       | Request                                      | Then              |
|-------------------|----------------------------------------------|-------------------|
| View player stats | `GET /stats/:userId`                         | Render stats      |
| View match history| `GET /stats/:userId/history?page=&limit=`    | Render list + pagination |
| View leaderboard  | `GET /stats/leaderboard?limit=&offset=`      | Render table      |
| View player rank  | `GET /stats/leaderboard/rank/:userId`        | Render rank/ELO   |

Use the same access token as for Auth Service; on 401, refresh token and retry (see Auth Service frontend guide).
