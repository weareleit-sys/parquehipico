# System Status

Last updated: 11 Jun 2026 by Codex

## Production Readiness: 88/100 — Ready for controlled deploy

This is no longer a fragile prototype. It is an internal, single-tenant lead tool that is deployable if Vercel env vars are correct and production smoke tests pass.

## Current State

| Item | Status |
|------|--------|
| TypeScript (`npx.cmd tsc --noEmit --pretty false`) | ✅ Pass |
| Build (`npm.cmd run build`) | ✅ Pass |
| Dev server (`localhost:3000`) | ✅ Running |
| Dashboard | ✅ Functional |
| Mobile-first card view | ✅ Default view, table hidden on mobile |
| Filter bar | ✅ Large mobile controls, sector select, clear category labels |
| Search (Gemini Grounding) | ✅ 75s server timeout, 10-lead cap, rate limited |
| Guion generation | ✅ Grounded, timeout, duplicate signature sanitizer |
| Find contact | ✅ Grounded, timeout, tolerant JSON parsing |
| Outreach logging | ✅ Protected and validates status/result/channel |
| Pagination | ✅ 25/page, default "pendientes" |
| Stats endpoint | ✅ List/stats totals verified |
| RLS public exposure | ✅ Anon REST smoke test returns no lead data |
| Deploy to Vercel | ⚠️ Pending |
| DB leads | 85 |

## Current Metrics

```text
Total          85
Pendientes     75
Contactados     9
Respondieron    0
Agendados       0
Prioridad alta 24
Revisar         3
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

## Architecture

```text
app/dashboard/
├── DashboardClient.tsx         mobile-first dashboard orchestrator
├── hooks/
│   ├── useLeads.ts             state + filters + pagination
│   ├── useSearch.ts            search flow (currently not on main dashboard)
│   └── useOutreach.ts          find-contact + log
├── components/
│   ├── SearchPanel.tsx         available component, not shown on main dashboard
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
- Internal category `cumpleanos` is shown as **Eventos familiares**.
- Exclude product-only party businesses from Eventos familiares.
- Include hotels, cabañas, centers, salones, venues and tourism operators when they can refer clients or need a larger outdoor venue.
- Sector should come from the lead's actual location when recognizable, not only from the search form.

## Security

- Middleware requires `DASHBOARD_TOKEN` in production for `/dashboard`, `/api/leads/*`, and `/api/outreach/*`.
- Localhost bypass is intentional for development.
- Browser calls protected Next.js API routes; it should not read/write Supabase tables directly.
- API routes use `getSupabaseAdmin()`.
- Supabase anon REST was tested and cannot read lead data.
- Rate limit protects Gemini search.

## Verification

Latest smoke:

```text
Dashboard HTTP        PASS   HTTP 200
Lead list API         PASS   85 leads
Stats API             PASS   total=85, categories=85
Category counts       PASS   educacion=7, turismo=11, comunidad=4, cumpleanos=29, municipal=4
Empty save validation PASS   HTTP 400
Supabase anon REST    PASS   no public lead data
```

Extra negative checks:

```text
invalid estado: HTTP 400
invalid categoria save: HTTP 400
list sanitized: PASS
```

## Next Steps

1. Confirm env vars in Vercel.
2. Deploy to Vercel.
3. Run production smoke tests.
4. Controlled use for 1-2 weeks.
5. Review low-fit leads and tune scoring/category prompts based on real replies.
