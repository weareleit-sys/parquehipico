# System Status

Last updated: 10 Jun 2026 by OpenCode

## Production Readiness: 84/100 — Ready for controlled deploy

## Current State

| Item | Status |
|------|--------|
| Build (`npx next build`) | ✅ Clean (no TypeScript errors) |
| Dev server (`localhost:3000`) | ✅ Running |
| Dashboard | ✅ Functional |
| Card view (Table/Cards toggle) | ✅ Working |
| Search (Gemini Grounding) | ✅ 45s timeout, rate limited |
| Guion generation | ✅ With Grounding, 2 retries, no horse hallucinations |
| Find contact | ✅ Finds email, phone, social |
| Outreach logging | ✅ With respuesta_fecha |
| Pagination | ✅ 25/page, default "pendientes" |
| RLS in code | ✅ All endpoints use service_role for reads+writes |
| RLS in Supabase | ⚠️ PENDING — `scripts/rls_fix.sql` needs execution |
| Deploy to Vercel | ⚠️ PENDING |
| BD leads | 52 |
| BD outreach | 10 |

## Architecture

```
app/dashboard/
├── DashboardClient.tsx         137 lines — orchestrator
├── hooks/
│   ├── useLeads.ts              state + filters + pagination
│   ├── useSearch.ts             form + search + phases
│   └── useOutreach.ts           find-contact + log
├── components/
│   ├── SearchPanel.tsx          sidebar
│   ├── FilterBar.tsx            chips
│   ├── LeadRow.tsx              table row + exported helpers
│   ├── LeadsTable.tsx           table + sort + pagination
│   └── LeadCardView.tsx         card grid
├── LeadCard.tsx                 individual card
├── data/sectores.ts             Araucanía sectors + WhatsApp templates
├── GuionModal.tsx               message modal
└── OutreachModal.tsx            contact tracking modal
```

## Security

- Middleware: token required in production, localhost bypass
- Auth: Bearer token in all API calls (no ?token= in URL for API)
- Supabase: Dual client (anon for nothing, service_role for everything via API routes)
- Rate limiting: 10 searches/5min per IP, PG function atomic
- RLS: Ready to close (code supports it, SQL pending)

## Next Steps (ordered)

1. Execute `scripts/rls_fix.sql` in Supabase
2. Add 7 env vars to Vercel
3. Deploy from Vercel dashboard
4. Smoke test production
5. 1-2 weeks controlled use, measure conversion metrics
