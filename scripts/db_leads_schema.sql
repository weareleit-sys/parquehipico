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

-- 2. OUTREACH
CREATE TABLE IF NOT EXISTS outreach (
  id SERIAL PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  contactado_por TEXT DEFAULT 'Alberto',
  fecha_contacto TIMESTAMPTZ DEFAULT NOW(),
  canal TEXT DEFAULT 'whatsapp',
  resultado TEXT DEFAULT 'pendiente',
  notas TEXT
);

CREATE INDEX IF NOT EXISTS idx_outreach_lead ON outreach (lead_id, fecha_contacto DESC);

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

-- 4. RLS POLICIES
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_all" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "outreach_all" ON outreach FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "search_jobs_all" ON search_jobs FOR ALL USING (true) WITH CHECK (true);
