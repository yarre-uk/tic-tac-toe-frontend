# Tic Tac Toe — Frontend

Multiplayer Tic Tac Toe client built with TanStack Start, React 19, and Socket.io. Deployed to Cloudflare Workers.

## Stack

| Layer | Library |
|---|---|
| Framework | TanStack Start + TanStack Router (file-based, SSR) |
| UI | React 19, Base UI, Tailwind CSS v4, CVA |
| State | Zustand, TanStack Query |
| Forms | React Hook Form + Zod |
| Real-time | Socket.io client |
| HTTP | Axios |
| Deploy | Cloudflare Workers (Wrangler) |

## Getting started

```bash
yarn
cp .env.example .env   # fill in required values
yarn dev
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | REST API base URL |
| `VITE_WS_URL` | Yes | WebSocket server URL |
| `VITE_IS_AUTH_ENABLED_FLAG` | No | Enable auth hooks (default `false`) |
| `VITE_IS_APP_ENABLED_FLAG` | No | Enable app route (default `false`) |
| `VITE_IS_GAME_ENABLED_FLAG` | No | Enable game route (default `false`) |
| `VITE_IS_DEV_TOOLS_ENABLED_FLAG` | No | Show TanStack DevTools panel (default `false`) |

Feature flags are coerced to booleans and validated at startup via Zod. The app throws on missing required variables.

## Scripts

```bash
yarn dev          # dev server
yarn build        # production build
yarn deploy       # build + deploy to Cloudflare Workers
yarn test         # Vitest
yarn lint         # ESLint
yarn format       # Prettier
yarn check        # lint + format check
```

## Project structure

```
src/
  routes/
    __root.tsx       # root layout — auth, socket, profile hooks
    index.tsx        # landing page
    app.tsx          # main app
    game.tsx         # game room with real-time updates
    (auth)/          # auth flow routes
  modules/
    auth/            # token refresh, auth state
    game/            # board, game logic, move handling
    rooms/           # room creation and lobby
    profile/         # user profile
    chat/            # in-game chat
    landing/         # landing page with animated background canvas
  components/
    ui/              # Button, Card, Input and other primitives
  lib/
    env.ts           # Zod-validated env vars
    flags.ts         # isFeatureEnabled() feature flag helper
    utils.ts         # cn, isDefined, randomInRange, etc.
```

## Feature flags

Flags are read from `VITE_*_FLAG` env vars and accessed via:

```ts
import { isFeatureEnabled } from '@/lib/flags';

if (isFeatureEnabled('IS_GAME_ENABLED')) { ... }
```

Adding a new flag: add `VITE_<NAME>_FLAG` to `EnvSchema` in `src/lib/env.ts` — the `Flag` type updates automatically.

## Deployment

```bash
yarn deploy
```

Deploys to Cloudflare Workers via Wrangler. Configuration is in `wrangler.jsonc`. Set production env vars in the Cloudflare dashboard or via `wrangler secret put`.
