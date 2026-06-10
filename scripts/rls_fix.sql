-- ============================================
-- CERRAR RLS — Ejecutar en Supabase SQL Editor
-- https://supabase.com/dashboard/project/hqpmmlrtqruoaptwzjbs/sql/new
-- ============================================

-- Eliminar políticas abiertas actuales
DROP POLICY IF EXISTS "leads_all" ON leads;
DROP POLICY IF EXISTS "outreach_all" ON outreach;
DROP POLICY IF EXISTS "search_jobs_all" ON search_jobs;

-- Nuevas políticas: anon solo SELECT, service_role todo
CREATE POLICY "leads_select" ON leads FOR SELECT USING (true);
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK ((SELECT auth.role() = 'service_role'));
CREATE POLICY "leads_update" ON leads FOR UPDATE USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "leads_delete" ON leads FOR DELETE USING ((SELECT auth.role() = 'service_role'));

CREATE POLICY "outreach_select" ON outreach FOR SELECT USING (true);
CREATE POLICY "outreach_insert" ON outreach FOR INSERT WITH CHECK ((SELECT auth.role() = 'service_role'));
CREATE POLICY "outreach_update" ON outreach FOR UPDATE USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "outreach_delete" ON outreach FOR DELETE USING ((SELECT auth.role() = 'service_role'));

CREATE POLICY "search_jobs_select" ON search_jobs FOR SELECT USING (true);
CREATE POLICY "search_jobs_insert" ON search_jobs FOR INSERT WITH CHECK ((SELECT auth.role() = 'service_role'));
CREATE POLICY "search_jobs_update" ON search_jobs FOR UPDATE USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "search_jobs_delete" ON search_jobs FOR DELETE USING ((SELECT auth.role() = 'service_role'));

-- Rate limits (ya tiene su propia política, la dejamos)
