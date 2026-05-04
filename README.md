# AI Builder

Public AI Builder portfolio site.

- **Pages:**
  - `/` (and `/ai-builder-dashboard.html`) — interactive Kanban roadmap, Notion-backed
  - `/ai-builder-plan.html` — project notes on how the site is built
- **API:** `/api/roadmap` — GET public rows / PATCH status by ID, against the Notion `AI Automation Roadmap` database. The public deploy sets `PUBLIC_ONLY=true` so only rows with `Public=true` are returned.

## Deploy

Pushes to `main` auto-deploy to production via Vercel's Git integration.

## Env vars

Set in Vercel:
- `NOTION_TOKEN` — Notion integration secret
- `NOTION_DATABASE_ID` — id of the AI Automation Roadmap database
