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

## 2026-06-12: Dashboard Uses Email/Password Login

The dashboard should be accessed through `/dashboard/login` with Supabase Auth credentials instead of asking non-technical users to paste a token in the URL.

Implication:

- `/api/auth/login` validates email/password with Supabase Auth using the anon key.
- A signed HTTP-only cookie (`ph_dashboard_session`) grants access to `/dashboard`, `/api/leads/*`, and `/api/outreach/*`.
- `/api/auth/logout` clears the dashboard session cookie.
- `DASHBOARD_TOKEN` remains as temporary fallback/maintenance access, but it should not be the normal user flow.
- Staff user verified in Supabase Auth: `staff@parquehipico.cl`.

## 2026-06-12: Search New Leads Is Separate From Filtering Saved Leads

Users confused the saved-lead text filter with the Gemini lead search.

Implication:

- The dashboard shows a prominent `Buscar nuevos contactos` section above saved lead filters.
- Defaults are optimized for the near-term use case: Productoras, Zona Lacustre, Pucón + Villarrica, 10 results.
- After a search succeeds, the dashboard automatically switches to the searched category/sector, clears the text filter, and leaves status as Pendientes.
- Fresh search results are kept in `newLeads` so cards/table can mark them as `Nuevo`.
- The saved-lead search input is labeled as a filter, not as lead generation.

## 2026-06-11: Phone Normalization

Only Chilean mobile numbers should be considered WhatsApp-compatible:

- `569...`
- `9xxxxxxxx`

Do not convert local 8-digit numbers to `+569...`.

## 2026-06-11: Mobile-First, Low-Tech Dashboard

The lead dashboard is for occasional internal use, often from phones, by users who prefer visible and simple controls.

Implication:

- Card view is the default and the table toggle is hidden on mobile.
- Buttons should be large enough for touch.
- Filters should use clear business labels instead of raw technical values.
- Avoid dense CRM-style layouts unless there is a proven need.

## 2026-06-11: `cumpleanos` Means Eventos Familiares

The database value `cumpleanos` remains for compatibility, but users see it as **Eventos familiares**.

Implication:

- Do not search for or present cotillón, party-supply stores, cake shops, balloon shops, toy stores, or product-only businesses as leads.
- Valid leads are organizers, venues, banqueterías, private celebration producers, quintas, salones, and services that could need a large outdoor venue.

## 2026-06-11: Lead Category Taxonomy

Category definitions live in `app/lib/lead-categories.ts` and are the source of truth for UI labels, search prompts, guion context, and fallback WhatsApp templates.

Current categories:

- Productoras de eventos
- Empresas y corporativos
- Matrimonios
- Eventos familiares
- Turismo y venues
- Colegios e instituciones
- Público y gobierno
- Comunidad y clubes

Important implications:

- Hotels, cabañas, centers, salons, and venues are valid leads/partners, especially under Turismo y venues or Eventos familiares.
- Remote leads without clear Araucanía/zona sur signal should be marked `externo` / Fuera de zona / revisar.
- Sector should come from the lead's actual location when recognizable, not only from the search form.

## 2026-06-11: Lead APIs Must Normalize And Validate Business Fields

The lead APIs should not accept arbitrary categories, statuses, sectors, limits, or search syntax.

Implication:

- `app/lib/lead-categories.ts` owns category aliases and canonical values.
- `/api/leads/list` normalizes category aliases, clamps pagination, validates status/sector, and sanitizes search.
- `/api/leads/save` validates category/status/sector and clamps score to 1-10.
- `/api/leads/stats` normalizes category keys before reporting metrics.
- Smoke tests must compare list total and stats total.
