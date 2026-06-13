# Current Plan

## Immediate

1. Review the current uncommitted Codex diff.
2. Commit locally when the user confirms the batch is ready.
3. Push once to trigger one consolidated Vercel deploy.
4. Smoke test production:
   - `/dashboard/login` loads.
   - Staff login reaches `/dashboard`.
   - `/api/leads/list?page=1&limit=2` without auth returns `401`.
   - Protected lead APIs work from the logged-in dashboard.
   - New search returns usable cards and shows fresh leads under the search box.
   - Fixed phones show `Llamar`, mobile phones show `WhatsApp`.
   - Generate guion works.
   - Find contact works.
   - Register outreach works.
   - Direct Supabase REST read with anon key cannot read `leads`.
   - `GOOGLE_MAPS_API_KEY` is active in production verification results.

## Next Product Work

1. Add `GOOGLE_MAPS_API_KEY` to local `.env.local` if local Places verification is needed.
2. Run small live searches by sector/category and tune the category-fit filter from real accepted/rejected leads.
3. Track weekly outreach metrics.
4. Improve deduplication with normalized company name, normalized phone, and domain.
5. Add simple conversion reporting by category and city.
6. Consider an admin-only review queue for rejected or low-confidence leads.

## Do Not Start Yet

- Do not rebuild the lead search as async jobs unless real timeout/frequency problems appear.
- Do not refactor admin ticket/payment pages while working on leads.
