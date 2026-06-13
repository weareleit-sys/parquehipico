# System Status

Last updated: 13 Jun 2026 by Codex

## Production Readiness: 91/100 — Ready for one consolidated deploy after final build

This is an internal, single-tenant lead tool that is deployable if the current uncommitted changes are committed, pushed once, and production smoke tests pass.

## Current State

| Item | Status |
|------|--------|
| TypeScript (`npx.cmd tsc --noEmit --pretty false`) | ✅ Pass |
| Build (`npm.cmd run build`) | ✅ Pass |
| Dev server (`localhost:3000`) | ✅ Running |
| Dashboard | ✅ Functional |
| Dashboard login | ✅ Supabase email/password + signed HTTP-only cookie |
| Mobile-first card view | ✅ Default view, table hidden on mobile |
| Mobile search flow | ✅ Search panel appears before metrics on mobile |
| Filter bar | ✅ Large mobile controls, sector select, clear category labels |
| Search (Gemini Grounding) | ✅ 75s server timeout, 10-lead cap, rate limited, category-fit/contactability filters |
| Link verification | ✅ Untrusted web/social links are hidden and marked "en revisión" |
| Phone actions | ✅ Valid mobile numbers use WhatsApp; valid fixed phones use `tel:`; bad placeholders are hidden |
| Guion generation | ✅ Grounded, timeout, duplicate signature sanitizer |
| Find contact | ✅ Grounded, timeout, tolerant JSON parsing |
| Outreach logging | ✅ Protected and validates status/result/channel |
| Pagination | ✅ 25/page, default "pendientes" |
| Stats endpoint | ✅ Includes verification state and failed-attempt counts |
| Old lead verification | ✅ Batch size 5; failed leads are skipped for 12h |
| RLS public exposure | ✅ Anon REST smoke test returns no lead data |
| Deploy to Vercel | ⚠️ Pending one consolidated push/deploy |
| Current working tree | ⚠️ Uncommitted Codex changes |

## Current Metrics

```text
Total         127
Pendientes    113
Contactados    10
Respondieron    0
Agendados       0
Buenos cand.   69
Prioridad alta  6
Sin revisar   108
Verificados    12
Parciales       2
Dudosos         5
Errores         0
Revisar         5
```

By category:

```text
corporativo  20
cumpleanos   28
turismo      15
matrimonios  13
productoras  16
educacion    14
comunidad     9
municipal    12
```

## Architecture

```text
app/dashboard/
├── DashboardClient.tsx         mobile-first dashboard orchestrator
├── hooks/
│   ├── useLeads.ts             state + filters + pagination
│   ├── useSearch.ts            search flow (currently not on main dashboard)
│   └── useOutreach.ts          find-contact + log
├── components/
│   ├── SearchPanel.tsx         main mobile-first lead search surface
│   ├── FilterBar.tsx           search + large category/status buttons + sector select
│   ├── LeadRow.tsx             table row + WhatsApp helpers
│   ├── LeadsTable.tsx          table + sort + pagination
│   └── LeadCardView.tsx        card grid
├── LeadCard.tsx                individual card
├── data/categories.ts          re-export from lib taxonomy
├── data/sectores.ts            Araucanía sectors + WhatsApp templates
├── GuionModal.tsx              message modal
└── OutreachModal.tsx           contact tracking modal
```

Shared lead taxonomy lives in:

```text
app/lib/lead-categories.ts
```

## Product Notes

- Users are expected to use the system occasionally, often from mobile, and prefer visible/simple controls.
- The dashboard should behave like a simple contact list, not a dense CRM.
- Search should be the first operational action on mobile: choose type, zone, city, quantity, then contact the fresh leads directly below the search box.
- Internal category `cumpleanos` is shown as **Eventos familiares**.
- Exclude product-only party businesses from Eventos familiares.
- Include hotels, cabañas, centers, salones, venues and tourism operators when they can refer clients or need a larger outdoor venue.
- Sector should come from the lead's actual location when recognizable, not only from the search form.
- Gemini search now asks for `actividad` and `motivo`; backend uses those fields to reject weak category matches before saving.
- Search now rejects leads with no actionable channel (no phone, email, website or social link).
- Phone normalization now rejects placeholders like `+`, truncated numbers and incomplete Chilean mobile numbers.

## Security

- Middleware requires a valid dashboard session cookie or temporary `DASHBOARD_TOKEN` fallback in production for `/dashboard`, `/api/leads/*`, and `/api/outreach/*`.
- Localhost bypass is intentional for development.
- Login route: `/dashboard/login`.
- Auth endpoints: `/api/auth/login`, `/api/auth/logout`.
- Staff user exists in Supabase Auth: `staff@parquehipico.cl`.
- Browser calls protected Next.js API routes; it should not read/write Supabase tables directly.
- API routes use `getSupabaseAdmin()`.
- Supabase anon REST was tested and cannot read lead data.
- Rate limit protects Gemini search.

## Verification

Latest smoke:

```text
Dashboard login       PASS   HTTP 200
Lead list API         PASS   total=127
Stats API             PASS   total=127, pending=113, goodCandidates=69, highPriority=6
Live education search PASS   5 plausible leads in Zona Lacustre
Find contact          PASS   completed missing contact for Colegio Epu Klei
TypeScript            PASS   npx.cmd tsc --noEmit --pretty false
```

Extra negative checks:

```text
invalid estado: HTTP 400
invalid categoria save: HTTP 400
list sanitized: PASS
```

## Next Steps

1. Review current diff and commit locally.
2. Push once to trigger the consolidated Vercel deploy.
3. Run production smoke tests.
4. Run small live searches by category/zone and review rejected/accepted lead quality.
5. Controlled use for 1-2 weeks.
6. Review low-fit leads and tune scoring/category prompts based on real replies.
