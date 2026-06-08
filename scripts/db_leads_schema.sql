-- ============================================
-- Parque Hípico La Montaña — Sistema de Leads
-- Ejecutar en: Supabase SQL Editor
-- ============================================

-- 1. LEADS
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL,              -- productoras | corporativo | matrimonios | municipal
  categorias TEXT[] DEFAULT '{}',       -- array nativo: {"productoras","corporativo"}
  estado_lead TEXT DEFAULT 'nuevo',     -- nuevo | en_proceso | contactado | agendado | descartado
  telefono TEXT,
  website TEXT,
  email TEXT,
  ubicacion TEXT,                       -- ciudad/región
  capacidad_estimada INT,               -- personas aproximadas del evento
  web_status TEXT,                      -- activa | caida | sin_web
  score INT CHECK (score BETWEEN 1 AND 10),
  redes TEXT,                           -- "ig,fb,wap"
  raw_data TEXT,                        -- JSON del análisis de Gemini
  guion TEXT,                           -- guion WhatsApp generado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_categoria ON leads (categoria);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads (estado_lead);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads (score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_categorias ON leads USING GIN (categorias);

-- 2. OUTREACH
CREATE TABLE IF NOT EXISTS outreach (
  id SERIAL PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  contactado_por TEXT DEFAULT 'Alberto',
  fecha_contacto TIMESTAMPTZ DEFAULT NOW(),
  canal TEXT DEFAULT 'whatsapp',
  resultado TEXT DEFAULT 'pendiente',   -- pendiente | contactado | respondio | agendado | rechazo
  notas TEXT
);

CREATE INDEX IF NOT EXISTS idx_outreach_lead ON outreach (lead_id, fecha_contacto DESC);

-- 3. SEARCH JOBS (async)
CREATE TABLE IF NOT EXISTS search_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT DEFAULT 'pending',        -- pending | running | done | error
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

-- ============================================
-- RLS POLICIES (ejecutar si las tablas ya existen)
-- ============================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_jobs ENABLE ROW LEVEL SECURITY;

-- Leads: acceso público temporal (igual que tickets)
CREATE POLICY "leads_select" ON leads FOR SELECT USING (true);
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_update" ON leads FOR UPDATE USING (true);
CREATE POLICY "leads_delete" ON leads FOR DELETE USING (true);

-- Outreach
CREATE POLICY "outreach_select" ON outreach FOR SELECT USING (true);
CREATE POLICY "outreach_insert" ON outreach FOR INSERT WITH CHECK (true);
CREATE POLICY "outreach_update" ON outreach FOR UPDATE USING (true);
CREATE POLICY "outreach_delete" ON outreach FOR DELETE USING (true);

-- Search Jobs
CREATE POLICY "search_jobs_select" ON search_jobs FOR SELECT USING (true);
CREATE POLICY "search_jobs_insert" ON search_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "search_jobs_update" ON search_jobs FOR UPDATE USING (true);
CREATE POLICY "search_jobs_delete" ON search_jobs FOR DELETE USING (true);
