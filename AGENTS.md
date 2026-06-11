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
- After code changes, run `npx.cmd tsc --noEmit --pretty false` and `npm.cmd run build` when feasible.

## Current Project

Primary app:

`D:\Proyectos Antigravity\parquehipico\parquehipico-nextjs`

Main lead-system areas:

- `app/dashboard/`
- `app/api/leads/`
- `app/api/outreach/`
- `app/lib/supabase.ts`
- `middleware.ts`
- `scripts/db_leads_schema.sql`
- `scripts/rls_fix.sql`

