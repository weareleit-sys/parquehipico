# Review Checklist

## Before Editing

- Run `git status --short`.
- Read `.agents/status.md` and `.agents/current-plan.md`.
- Confirm whether another agent has uncommitted changes.

## TypeScript / Build

Run when touching app code:

```powershell
npx.cmd tsc --noEmit --pretty false
npm.cmd run build
```

Expected:

- TypeScript exits 0.
- Next production build exits 0.

Non-blocking warnings:

- `baseline-browser-mapping` stale.
- `Browserslist/caniuse-lite` stale.

## Lead Security

Check:

- `/api/leads/*` protected by middleware.
- `/api/outreach/*` protected by middleware.
- Internal client fetches use `Authorization: Bearer`.
- No new `?token=` API calls.
- Server lead/outreach routes use `getSupabaseAdmin()`.
- No service role key in client code or `NEXT_PUBLIC_*`.

## Supabase RLS

Sensitive tables should not be readable by anon:

- `leads`
- `outreach`
- `search_jobs`
- `rate_limits`

Use `scripts/rls_fix.sql` as the current source of truth.

## Product Smoke Test

- Dashboard loads with token.
- API list without token returns 401 in deployed/prod host.
- Lead list works with token.
- Generate guion works.
- Find contact works.
- Register outreach works.

