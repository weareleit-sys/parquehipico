# Agent Coordination

This repo may be edited by multiple coding agents, mainly Codex and OpenCode.
Before starting work, read:

- `.agents/status.md`
- `.agents/current-plan.md`
- `.agents/decisions.md`
- `.agents/review-checklist.md`

Use `.agents/handoff-opencode.md` and `.agents/handoff-codex.md` to pass context between agents.

## Rules

- Run `git status --short` before editing.
- Do not overwrite another agent's uncommitted work.
- Keep changes scoped to the requested task.
- For lead-system work, protect production data first: no public reads of `leads`, `outreach`, `search_jobs`, or `rate_limits`.
- Do not put secrets in repo files, handoffs, logs, screenshots, or docs.
- Prefer `Authorization: Bearer <token>` for dashboard API calls. Avoid `?token=` except for the initial dashboard entry URL.
- Server-side lead/outreach reads and writes should go through protected API routes and `getSupabaseAdmin()`.
- After code changes, run `npm run build` when feasible.

## Current Project

Primary app: `D:\Proyectos Antigravity\parquehipico\web`

Main lead-system areas:
- `app/dashboard/` — UI (orchestrator, hooks, components, modals, cards)
- `app/api/leads/` — search, list, save, stats, find-contact, generar-guion, verify, verify-missing
- `app/api/outreach/` — contact log
- `app/api/auth/` — login/logout
- `app/lib/` — supabase, rate-limit, lead-categories, lead-links, lead-verification, auth-session
- `middleware.ts` — auth required in production
- `scripts/db_leads_schema.sql` — full PostgreSQL schema
- `scripts/rls_fix.sql` — RLS policies (service_role only)
- `scripts/smoke_leads_system.ps1` — smoke test script

## Architecture Notes

### Categories (`app/lib/lead-categories.ts`)
8 categories with typed definitions: productoras, corporativo, matrimonios, cumpleanos (displayed as "Eventos familiares"), turismo, educacion, municipal, comunidad. Each has: searchPrompt, guionContext, template, role, icon. Use `normalizeLeadCategoryValue()` for aliasing and `getLeadCategoryDefinition()` for the full definition.

### Verification (`app/lib/lead-verification.ts`)
777-line quality verification system. Uses Google Places API, website crawling, social handle validation. Exports `verifyLeadData(lead)` → `{ status, fields, updates, notes }`. Version tracked via `LEAD_VERIFICATION_VERSION` in `lead-verification-version.ts`. Run via `POST /api/leads/verify` for single lead or `POST /api/leads/verify-missing` for batch.

### Dry Run Search Mode
`POST /api/leads/search` accepts optional `dryRun: true` param. When set, Gemini searches and returns results but does NOT save them to the database. Useful for testing prompt quality or checking what leads would be found before committing. Results are returned in the same format as normal search but with `dryRun: true` in the response and no DB writes.

### Conversion Metrics
`GET /api/leads/stats` returns outreach metrics: `totalOutreach`, `withResponse`, `responseRate` (%), `avgResponseHours`, `byResult`. Use this to measure team effectiveness and guion quality over time.

