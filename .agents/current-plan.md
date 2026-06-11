# Current Plan

## Immediate

1. Apply `scripts/rls_fix.sql` to Supabase production project.
2. Smoke test production:
   - `/dashboard?token=...` loads leads.
   - `/api/leads/list?page=1&limit=2` without token returns `401`.
   - `/api/leads/list?page=1&limit=2` with bearer token returns leads.
   - Direct Supabase REST read with anon key cannot read `leads`.
   - Generate guion works.
   - Find contact works.
   - Register outreach works.

## Next Product Work

1. Track weekly outreach metrics.
2. Improve deduplication with normalized company name, normalized phone, and domain.
3. Add simple conversion reporting by category and city.
4. Replace token URL entry with real auth/session when the tool grows beyond trusted internal use.

## Do Not Start Yet

- Do not rebuild the lead search as async jobs unless real timeout/frequency problems appear.
- Do not refactor admin ticket/payment pages while working on leads.

