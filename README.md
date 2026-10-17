# Jetic Web

Agent-powered API workspace. Next.js App Router + TypeScript + Tailwind CSS.

## Stack

- Next.js 16 (App Router, `cacheComponents` enabled) + React 19
- TypeScript, Tailwind CSS v4
- Vitest (unit/integration), Playwright (e2e)

Requires Node `>=20.19` (CI uses Node 22).

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

Feature-oriented, per `strict.md`:

- `src/app/` — routes only (route groups `(marketing)`, `(auth)`, `(product)`, plus `docs` and `api/health`). Pages orchestrate; features implement.
- `src/components/` — genuinely shared UI (`ui/`, `feedback/`, `providers/`).
- `src/features/` — domain modules (`agent`, `simulation`, `repository`, `workspace`, `environment`, `settings`, `auth`, `marketing`). Each owns components, hooks, api, schemas, types, utils behind a small `index.ts`.
- `src/lib/` — typed API client, env, logger, utils, constants.
- `src/server/` — server-only auth, backend, security helpers.
- `src/hooks/`, `src/config/`, `src/types/` — only what is truly shared.
- `content/docs/*.mdx` — documentation source for `/docs`.
- `tests/` — `unit/`, `integration/` (Vitest), `e2e/` (Playwright).

## Rules

1. Pages orchestrate; features implement.
2. Features own their domain; cross-feature imports go through `index.ts`.
3. Shared means genuinely shared.
4. Server Components by default; `"use client"` only where needed.
5. Validate at trust boundaries (see `features/agent/schemas/`).
6. Backend is authoritative for auth, execution, and permissions. No private keys in `NEXT_PUBLIC_*`.

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint`
- `pnpm test` (vitest) / `pnpm test:e2e` (playwright)
