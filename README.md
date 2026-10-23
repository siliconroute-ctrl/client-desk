# Client Desk

A cloud-hosted tracker for clients, daily duties, due dates, reminders, important mail and money owed, built as an accessible PWA for phone and desktop.

- Scope, phases and rules: [`docs/BUILD_BRIEF.md`](docs/BUILD_BRIEF.md). Decisions that change the brief are logged in [`CLAUDE.md`](CLAUDE.md).
- Setup from scratch, deploy and rollback: [`docs/SETUP.md`](docs/SETUP.md)
- Monthly costs: [`docs/COSTS.md`](docs/COSTS.md)
- Design system: https://claude.ai/artifact/9Ut43MYrTjkyzgLmFUeuWW (tokens and component styles in [`app/src/styles/`](app/src/styles/))

## Layout

| Path | What |
| --- | --- |
| `app/` | Frontend: React + TypeScript + Vite, installable PWA |
| `supabase/` | Database migrations, seed data, Edge Functions and their tests (from Phase 1) |
| `docs/` | Brief, setup, costs, and later privacy and runbook |
| `.github/workflows/ci.yml` | Typecheck, unit tests, build, browser and accessibility tests, secret scan; deploys `main` to Firebase Hosting |
| `.github/workflows/backup.yml` | Nightly Supabase keep-alive and encrypted backup to Google Drive |

## Quick start

```
cd app
npm install
npm run dev
```

Status: Phase 0 (scaffold). Sign-in, clients and tasks arrive in Phase 1.
