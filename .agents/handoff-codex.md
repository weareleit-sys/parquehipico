# Handoff From Codex

Last updated: 11 Jun 2026 by Codex.

## Current State

- Working tree has uncommitted Codex changes.
- Dev server is running on `http://localhost:3000`.
- Production build passes: `npm.cmd run build`.
- TypeScript passes: `npx.cmd tsc --noEmit --pretty false`.
- Smoke test passes: `powershell -ExecutionPolicy Bypass -File scripts\smoke_leads_system.ps1`.
- Supabase anon REST was verified: anon key cannot read lead data.
- Current lead count is **85**.
- Dashboard login is now implemented with Supabase email/password auth.

## What Changed Since The Previous Handoff

### Mobile-first dashboard

- Dashboard defaults to card view.
- Old search sidebar was removed from the main dashboard surface.
- Filters are larger and simpler for phone use.
- Sector filter is a native select.
- Metrics strip added: Total, Pendientes, Prioridad alta, Agendados, Revisar.
- Metrics now refresh after outreach/guion changes, not only after manual reload.

### Category taxonomy

Source of truth is now `app/lib/lead-categories.ts`.

Current categories:

- `productoras` — Productoras de eventos
- `corporativo` — Empresas y corporativos
- `matrimonios` — Matrimonios
- `cumpleanos` — Eventos familiares
- `turismo` — Turismo y venues
- `educacion` — Colegios e instituciones
- `municipal` — Público y gobierno
- `comunidad` — Comunidad y clubes

Important decisions:

- `cumpleanos` stays as DB key, but the business label is **Eventos familiares**.
- Product-only party businesses are excluded: cotillón, globos, tortas, piñaterías, dulcerías, jugueterías, regalos, artículos de fiesta.
- Hotels, cabañas, venues, centers, salones and tourism operators are valid leads/partners when they can refer clients or need a larger outdoor venue.
- Remote leads without clear Araucanía/zona sur signal are marked as `sector='externo'`.

### API hardening

- `/api/leads/list`
  - Normalizes category aliases like `Productoras` -> `productoras`.
  - Validates category/status/sector.
  - Clamps pagination.
  - Sanitizes search strings before building PostgREST `.or(...)`.
- `/api/leads/save`
  - Validates category/status/sector before writing.
  - Normalizes category/categorias.
  - Clamps score to 1-10.
  - Supports sector updates safely.
- `/api/leads/stats`
  - New endpoint.
  - Normalizes category keys in metrics.
- `/api/leads/search`
  - Uses centralized category prompts.
  - Max search limit clamped to 10.
  - Search timeout is 75s server-side.
  - Gemini JSON parser handles fenced or extra text around JSON.
  - Lead quality metadata added to `raw_data`.
  - Sector inferred from actual lead location where possible.
- `/api/leads/find-contact`
  - Added 60s timeout.
  - Gemini JSON parser is more tolerant.
- `/api/leads/generar-guion`
  - Added 60s Gemini timeout.
  - JSON parser is more tolerant.
  - Uses category context, not raw category key.
  - Sanitizes duplicate signatures.
  - Prompt avoids caballos/equino/capacity/technical specs in WhatsApp copy.

### Dashboard auth

- New login page: `/dashboard/login`.
- New auth endpoints: `/api/auth/login`, `/api/auth/logout`.
- Login validates email/password with Supabase Auth.
- Server sets a signed HTTP-only cookie (`ph_dashboard_session`) for 7 days.
- Middleware accepts either the signed cookie or the old `DASHBOARD_TOKEN` fallback.
- Dashboard has a visible `Salir` button.
- Verified Supabase Auth contains confirmed user `staff@parquehipico.cl`.

### Smoke test

New script: `scripts/smoke_leads_system.ps1`.

Checks:

- Dashboard HTTP 200.
- Dashboard login HTTP 200.
- Auth login validation returns 400 for empty payload.
- Auth logout returns 200.
- Lead list API total.
- Stats API total equals list total.
- Category totals equal stats total.
- Key category counts.
- Empty save validation returns 400.
- Supabase anon REST cannot read lead data.

Latest result:

```text
Dashboard HTTP        PASS   HTTP 200
Lead list API         PASS   85 leads
Stats API             PASS   total=85, categories=85
Category counts       PASS   educacion=7, turismo=11, comunidad=4, cumpleanos=29, municipal=4
Empty save validation PASS   HTTP 400
Supabase anon REST    PASS   no public lead data
```

## Current Data Snapshot

```text
total       85
pending     75
contacted    9
replied      0
scheduled    0
highPriority 24
review       3
```

By category:

```text
matrimonios  11
cumpleanos   29
corporativo  13
turismo      11
productoras   6
educacion     7
comunidad     4
municipal     4
```

## Production Pending

1. Confirm the same env vars exist in Vercel:
   - `DASHBOARD_TOKEN`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `MP_ACCESS_TOKEN`
2. Deploy to Vercel.
3. Smoke test production:
   - `/dashboard?token=...` loads.
   - `/api/leads/list` without token returns 401.
   - `/api/leads/list` with Bearer token returns leads.
   - Generate guion works.
   - Find contact works.
   - Outreach log works.
   - Supabase anon REST returns `[]` or denied.

## Notes For OpenCode

- Do not reintroduce the old dashboard search sidebar unless the user explicitly asks. The user wants the operational surface to stay simple/mobile-first.
- If adding categories, update `app/lib/lead-categories.ts` first.
- If changing filters, keep phone/touch use as the priority.
- Avoid changing RLS by making anon direct reads work. Browser should go through protected Next API routes.
