-- ============================================
-- Parque Hípico La Montaña — Sistema de Leads
-- Ejecutar TODO DE UNA en: Supabase SQL Editor
-- https://supabase.com/dashboard/project/hqpmmlrtqruoaptwzjbs/sql/new
-- ============================================

-- 1. LEADS
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL,
  categorias TEXT[] DEFAULT '{}',
  estado_lead TEXT DEFAULT 'nuevo',
  telefono TEXT,
  website TEXT,
  email TEXT,
  ubicacion TEXT,
  sector TEXT,
  capacidad_estimada INT,
  web_status TEXT,
  score INT CHECK (score BETWEEN 1 AND 10),
  redes TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  raw_data TEXT,
  guion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migración para BD existentes
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sector TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tiktok TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_categoria ON leads (categoria);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads (estado_lead);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads (score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_categorias ON leads USING GIN (categorias);
CREATE INDEX IF NOT EXISTS idx_leads_sector ON leads (sector);

-- Índice único parcial para deduplicación por teléfono (solo WhatsApp, ignora vacíos)
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_telefono_unico ON leads (telefono) WHERE telefono IS NOT NULL AND telefono != '' AND telefono LIKE '+569%';

-- 2. OUTREACH
CREATE TABLE IF NOT EXISTS outreach (
  id SERIAL PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  contactado_por TEXT DEFAULT 'Alberto',
  fecha_contacto TIMESTAMPTZ DEFAULT NOW(),
  canal TEXT DEFAULT 'whatsapp',
  resultado TEXT DEFAULT 'pendiente',
  notas TEXT,
  respuesta_fecha TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outreach_lead ON outreach (lead_id, fecha_contacto DESC);
CREATE INDEX IF NOT EXISTS idx_outreach_respuesta ON outreach (respuesta_fecha);

-- Migración para BD existentes
ALTER TABLE outreach ADD COLUMN IF NOT EXISTS respuesta_fecha TIMESTAMPTZ;

-- 3. SEARCH JOBS
CREATE TABLE IF NOT EXISTS search_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT DEFAULT 'pending',
  rubro TEXT,
  ubicacion TEXT,
  total_leads INT DEFAULT 0,
  leads_done INT DEFAULT 0,
  leads_found JSONB DEFAULT '[]',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_jobs_status ON search_jobs (status);

-- 5. RATE LIMITS
CREATE TABLE IF NOT EXISTS rate_limits (
  ip TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  count INT DEFAULT 0,
  reset_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (ip, endpoint)
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rate_limits_all" ON rate_limits FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION check_rate_limit(p_ip TEXT, p_endpoint TEXT, p_max INT, p_window_min INT)
RETURNS TABLE(count INT, reset_at TIMESTAMPTZ, allowed BOOLEAN) AS $$
BEGIN
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

-- 6. RLS POLICIES
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_all" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "outreach_all" ON outreach FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "search_jobs_all" ON search_jobs FOR ALL USING (true) WITH CHECK (true);
