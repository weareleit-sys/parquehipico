# Current Status

Last known commit:

`315d651 fix: RLS realmente cerrada (service_role en todo), Bearer auth (no ?token= en URL), WhatsApp sin falsos positivos, save parcial, outreach validacion enums, middleware fail-open cerrado`

Working tree when this file was created:

Clean before adding `.agents/` and `AGENTS.md`.

## Lead System State

Score estimate: 84/100 as an internal controlled tool.

Build status:

- `npx.cmd tsc --noEmit --pretty false`: passing after `315d651`.
- `npm.cmd run build`: passing after `315d651`.

Known production requirement:

- `scripts/rls_fix.sql` must be executed in Supabase SQL Editor or through Supabase MCP.

Required production env vars:

- `DASHBOARD_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## Important Warning

The code is prepared for closed RLS, but the remote Supabase database may still have old policies until `scripts/rls_fix.sql` is applied.

