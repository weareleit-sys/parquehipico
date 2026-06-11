# Supabase Runbook

Project ref:

`hqpmmlrtqruoaptwzjbs`

## Current SQL Files

- `scripts/db_leads_schema.sql`: schema/bootstrap reference.
- `scripts/rls_fix.sql`: production RLS hardening script.

## Preferred Way To Apply Changes

Use Supabase MCP from Codex when the user explicitly approves.

For DDL/policy changes, use an applied migration with a descriptive snake_case name.

Example migration name:

`harden_leads_rls_service_role_only`

## Manual Fallback

Paste `scripts/rls_fix.sql` into Supabase SQL Editor and run it.

## Verification After RLS

1. Dashboard with token loads.
2. API without token returns 401:

```text
GET /api/leads/list?page=1&limit=2
```

3. API with bearer token returns leads.
4. Supabase REST with anon key cannot read `leads`.
5. Generate guion, find contact, and outreach still work.

## Safety Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY`.
- Do not connect broad MCP access to production unless the user explicitly approves.
- Prefer project-scoped Supabase MCP access.
- Review SQL before applying it.

