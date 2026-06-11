-- ============================================
-- CERRAR RLS - Ejecutar en Supabase SQL Editor
-- https://supabase.com/dashboard/project/hqpmmlrtqruoaptwzjbs/sql/new
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Eliminar politicas abiertas y politicas previas
DROP POLICY IF EXISTS "leads_all" ON leads;
DROP POLICY IF EXISTS "outreach_all" ON outreach;
DROP POLICY IF EXISTS "search_jobs_all" ON search_jobs;
DROP POLICY IF EXISTS "rate_limits_all" ON rate_limits;

DROP POLICY IF EXISTS "leads_select" ON leads;
DROP POLICY IF EXISTS "leads_insert" ON leads;
DROP POLICY IF EXISTS "leads_update" ON leads;
DROP POLICY IF EXISTS "leads_delete" ON leads;
DROP POLICY IF EXISTS "outreach_select" ON outreach;
DROP POLICY IF EXISTS "outreach_insert" ON outreach;
DROP POLICY IF EXISTS "outreach_update" ON outreach;
DROP POLICY IF EXISTS "outreach_delete" ON outreach;
DROP POLICY IF EXISTS "search_jobs_select" ON search_jobs;
DROP POLICY IF EXISTS "search_jobs_insert" ON search_jobs;
DROP POLICY IF EXISTS "search_jobs_update" ON search_jobs;
DROP POLICY IF EXISTS "search_jobs_delete" ON search_jobs;
DROP POLICY IF EXISTS "rate_limits_select" ON rate_limits;
DROP POLICY IF EXISTS "rate_limits_insert" ON rate_limits;
DROP POLICY IF EXISTS "rate_limits_update" ON rate_limits;
DROP POLICY IF EXISTS "rate_limits_delete" ON rate_limits;

-- El dashboard y las APIs protegidas leen/escriben con service_role.
-- La anon key no debe poder leer leads, outreach, jobs ni rate limits directamente.
CREATE POLICY "leads_select" ON leads FOR SELECT USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK ((SELECT auth.role() = 'service_role'));
CREATE POLICY "leads_update" ON leads FOR UPDATE USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "leads_delete" ON leads FOR DELETE USING ((SELECT auth.role() = 'service_role'));

CREATE POLICY "outreach_select" ON outreach FOR SELECT USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "outreach_insert" ON outreach FOR INSERT WITH CHECK ((SELECT auth.role() = 'service_role'));
CREATE POLICY "outreach_update" ON outreach FOR UPDATE USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "outreach_delete" ON outreach FOR DELETE USING ((SELECT auth.role() = 'service_role'));

CREATE POLICY "search_jobs_select" ON search_jobs FOR SELECT USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "search_jobs_insert" ON search_jobs FOR INSERT WITH CHECK ((SELECT auth.role() = 'service_role'));
CREATE POLICY "search_jobs_update" ON search_jobs FOR UPDATE USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "search_jobs_delete" ON search_jobs FOR DELETE USING ((SELECT auth.role() = 'service_role'));

CREATE POLICY "rate_limits_select" ON rate_limits FOR SELECT USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "rate_limits_insert" ON rate_limits FOR INSERT WITH CHECK ((SELECT auth.role() = 'service_role'));
CREATE POLICY "rate_limits_update" ON rate_limits FOR UPDATE USING ((SELECT auth.role() = 'service_role'));
CREATE POLICY "rate_limits_delete" ON rate_limits FOR DELETE USING ((SELECT auth.role() = 'service_role'));

-- Fix rate-limit RPC used by app/lib/rate-limit.ts.
CREATE OR REPLACE FUNCTION check_rate_limit(p_ip TEXT, p_endpoint TEXT, p_max INT, p_window_min INT)
RETURNS TABLE(count INT, reset_at TIMESTAMPTZ, allowed BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO rate_limits (ip, endpoint, count, reset_at)
  VALUES (p_ip, p_endpoint, 1, NOW() + (p_window_min || ' minutes')::INTERVAL)
  ON CONFLICT (ip, endpoint) DO UPDATE
  SET count = CASE
    WHEN rate_limits.reset_at <= NOW() THEN 1
    ELSE rate_limits.count + 1
  END,
  reset_at = CASE
    WHEN rate_limits.reset_at <= NOW() THEN NOW() + (p_window_min || ' minutes')::INTERVAL
    ELSE rate_limits.reset_at
  END
  RETURNING rate_limits.count, rate_limits.reset_at, (rate_limits.count <= p_max) AS allowed;
END;
$$ LANGUAGE plpgsql;
