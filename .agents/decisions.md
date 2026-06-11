# Decisions

## 2026-06-11: Lead System Is Internal Single-Tenant

The system is optimized for a small internal team, not public multi-tenant use.

Implication:

- Synchronous Gemini search is acceptable for now.
- Jobs/queues are future work, not a blocker.

## 2026-06-11: Supabase Access Model

The browser must not read or write `leads`, `outreach`, `search_jobs`, or `rate_limits` directly through anon.

Current model:

- Browser calls protected Next.js API routes.
- Middleware checks `DASHBOARD_TOKEN`.
- Client API calls use `Authorization: Bearer <token>`.
- Server routes use `getSupabaseAdmin()`.
- RLS should allow only `service_role` on sensitive tables.

## 2026-06-11: Token Handling

Allowed:

- Initial entry via `/dashboard?token=...`.
- Internal fetches via `Authorization: Bearer`.

Avoid:

- Passing tokens in query strings for API calls.

Future:

- Replace token entry with Supabase Auth or another real session mechanism.

## 2026-06-11: Phone Normalization

Only Chilean mobile numbers should be considered WhatsApp-compatible:

- `569...`
- `9xxxxxxxx`

Do not convert local 8-digit numbers to `+569...`.

