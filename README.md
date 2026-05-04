# AI Builder

Chris Detloff's public AI Builder portfolio site.

- **Live:** TBD on first deploy
- **Pages:**
  - `/` (and `/ai-builder-dashboard.html`) — interactive Kanban roadmap, Notion-backed
  - `/ai-builder-plan.html` — six-build automation portfolio plan
  - `/time-audit.html` — 30-day time audit that justifies the build plan
- **API:** `/api/roadmap` — GET all rows / PATCH status by ID, against the Notion `AI Automation Roadmap` database

## Deploy

Pushes to `main` auto-deploy to production via Vercel's Git integration.

## Env vars

Set in Vercel:
- `NOTION_TOKEN` — Notion integration secret
- `NOTION_DATABASE_ID` — id of the AI Automation Roadmap database
