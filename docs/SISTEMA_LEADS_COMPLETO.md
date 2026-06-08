# Sistema de Leads — Parque Hípico La Montaña
## Documentación completa para otra IA

---

## 1. ARQUITECTURA GENERAL

```
┌──────────────────────────────────────────────────────┐
│  DASHBOARD (/dashboard)                              │
│  ┌────────────┐  ┌──────────────────────────────────┐│
│  │ Panel      │  │ Tabla de Leads                   ││
│  │ Lateral    │  │ Filtros: categoría · sector      ││
│  │            │  │         · estado · búsqueda      ││
│  │ Categoría ▼│  │                                  ││
│  │ Sector   ▼ │  │ Empresa | Sector | Cat | Ciudad  ││
│  │ Ciudad   ▼ │  │ Redes  | Estado | Contacto       ││
│  │ Cantidad   │  │                                  ││
│  │ [Buscar]   │  │ Contacto: web · WhatsApp ·       ││
│  │            │  │           Buscar contacto         ││
│  │ Resultados │  │                                  ││
│  │ encontrados│  │ Outreach modal (click estado)     ││
│  └────────────┘  └──────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐  ┌──────────────────────┐
│ /api/leads/*    │  │ /api/outreach/log    │
│ search (POST)   │  │ POST: registrar      │
│ find-contact    │  │ GET: historial       │
│ list   (GET)    │  └──────────────────────┘
│ save   (POST)   │
│ analizar (POST) │──── legacy, no se usa
│ job-status (GET)│──── legacy, no se usa
│ search/execute──│──── legacy, no se usa
│ analizar/execute│──── legacy, solo analizar
└─────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│  SUPABASE (PostgreSQL)                       │
│  Tablas: leads, outreach, search_jobs        │
│  RLS: políticas abiertas (desarrollo)        │
└──────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────┐    ┌──────────────────┐
│ Gemini 2.5  │    │ WhatsApp (wa.me) │
│ Flash       │    │ Instagram        │
│ + Grounding │    │ Facebook         │
│ (búsqueda   │    │ TikTok           │
│  Google)    │    │ Web              │
└─────────────┘    └──────────────────┘
```

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL), Gemini 2.5 Flash con Google Grounding

**Archivos clave:**
- `app/dashboard/page.tsx` — Server Component, SSR con datos iniciales
- `app/dashboard/DashboardClient.tsx` — Client Component, toda la UI y lógica
- `app/dashboard/OutreachModal.tsx` — Modal para registrar contactos
- `app/api/leads/search/route.ts` — **Búsqueda principal** (sincrónica, llama a Gemini + guarda en BD)
- `app/api/leads/find-contact/route.ts` — **Buscar contacto** de un lead sin teléfono
- `app/api/leads/list/route.ts` — Listar leads con filtros
- `app/api/outreach/log/route.ts` — Registrar/historial de outreach
- `app/lib/supabase.ts` — Cliente Supabase server-side (usa `getSupabase()`)
- `app/lib/supabaseClient.ts` — Cliente Supabase client-side (usa `supabase` singleton)

---

## 2. BASE DE DATOS (Supabase PostgreSQL)

### Tabla `leads` (principal)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | Autogenerado |
| `empresa` | TEXT UNIQUE NOT NULL | Nombre de la empresa (clave única para upsert) |
| `categoria` | TEXT NOT NULL | productoras / corporativo / matrimonios / cumpleanos / municipal |
| `categorias` | TEXT[] DEFAULT '{}' | Array para filtros (ej: {"productoras","corporativo"}) |
| `estado_lead` | TEXT DEFAULT 'nuevo' | nuevo / en_proceso / contactado / agendado / descartado |
| `telefono` | TEXT | Teléfono de contacto (viene de Gemini) |
| `website` | TEXT | Sitio web |
| `email` | TEXT | Email |
| `ubicacion` | TEXT | Ciudad/localidad (ej: "Temuco", "Villarrica") |
| **`sector`** | TEXT | **NUEVO** temuco / lacustre / sur / costa / norte / lagos |
| `capacidad_estimada` | INT | Capacidad de eventos |
| `web_status` | TEXT | activa / caida / sin_web |
| `score` | INT 1-10 | Legacy, ya no se usa |
| `redes` | TEXT | Legacy ("ig,fb,wap") |
| **`instagram`** | TEXT | **NUEVO** Usuario/URL de Instagram |
| **`facebook`** | TEXT | **NUEVO** Usuario/URL de Facebook |
| **`tiktok`** | TEXT | **NUEVO** Usuario/URL de TikTok |
| `raw_data` | TEXT | JSON crudo de la respuesta de Gemini |
| `guion` | TEXT | Legacy, guion WhatsApp generado por scoring |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

**Índices:** categoria, estado_lead, score, categorias (GIN), sector

### Tabla `outreach` (seguimiento de contactos)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | SERIAL PK | |
| `lead_id` | UUID FK → leads(id) ON DELETE CASCADE | |
| `contactado_por` | TEXT DEFAULT 'Alberto' | |
| `fecha_contacto` | TIMESTAMPTZ DEFAULT NOW() | |
| `canal` | TEXT DEFAULT 'whatsapp' | |
| `resultado` | TEXT DEFAULT 'pendiente' | pendiente / contactado / respondio / agendado / rechazo |
| `notas` | TEXT | |

### Tabla `search_jobs` (legacy, usada solo por analizar)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | |
| `status` | TEXT DEFAULT 'pending' | pending / running / done / error |
| `rubro` | TEXT | Categoría buscada |
| `ubicacion` | TEXT | Ciudad buscada |
| `total_leads` | INT | |
| `leads_done` | INT | |
| `leads_found` | JSONB DEFAULT '[]' | |
| `error` | TEXT | |

### RLS Policies (desarrollo — acceso público total)

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_all" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "outreach_all" ON outreach FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "search_jobs_all" ON search_jobs FOR ALL USING (true) WITH CHECK (true);
```

### SQL completo para inicializar

```sql
-- Pegar TODO en Supabase SQL Editor
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL,
  categorias TEXT[] DEFAULT '{}',
  estado_lead TEXT DEFAULT 'nuevo',
  telefono TEXT, website TEXT, email TEXT, ubicacion TEXT, sector TEXT,
  capacidad_estimada INT, web_status TEXT,
  score INT CHECK (score BETWEEN 1 AND 10), redes TEXT,
  instagram TEXT, facebook TEXT, tiktok TEXT,
  raw_data TEXT, guion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sector TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tiktok TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_categoria ON leads (categoria);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads (estado_lead);
CREATE INDEX IF NOT EXISTS idx_leads_categorias ON leads USING GIN (categorias);
CREATE INDEX IF NOT EXISTS idx_leads_sector ON leads (sector);

CREATE TABLE IF NOT EXISTS outreach (
  id SERIAL PRIMARY KEY, lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  contactado_por TEXT DEFAULT 'Alberto',
  fecha_contacto TIMESTAMPTZ DEFAULT NOW(), canal TEXT DEFAULT 'whatsapp',
  resultado TEXT DEFAULT 'pendiente', notas TEXT
);
CREATE INDEX IF NOT EXISTS idx_outreach_lead ON outreach (lead_id, fecha_contacto DESC);

CREATE TABLE IF NOT EXISTS search_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, status TEXT DEFAULT 'pending',
  rubro TEXT, ubicacion TEXT, total_leads INT DEFAULT 0, leads_done INT DEFAULT 0,
  leads_found JSONB DEFAULT '[]', error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_search_jobs_status ON search_jobs (status);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_all" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "outreach_all" ON outreach FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "search_jobs_all" ON search_jobs FOR ALL USING (true) WITH CHECK (true);
```

---

## 3. API ENDPOINTS

### 3.1 `POST /api/leads/search` ← **PRINCIPAL, ACTIVO**

**Input:**
```json
{ "categoria": "cumpleanos", "ubicacion": "Villarrica", "sector": "lacustre", "limit": 10 }
```

**Flujo (TODO sincrónico en una sola request):**
1. Construye prompt con categoría, ciudad, sector
2. Llama a Gemini 2.5 Flash con Google Grounding
3. Gemini busca en Google empresas reales con teléfono, web, redes sociales
4. Limpia respuesta Markdown → parsea JSON
5. Hace upsert en `leads` (ON CONFLICT empresa)
6. Devuelve los leads guardados

**Output:**
```json
{
  "success": true,
  "leads": [
    { "empresa": "...", "telefono": "...", "website": "...", "ubicacion": "...",
      "instagram": "...", "facebook": "...", "tiktok": "...", "id": "uuid", "sector": "lacustre" }
  ],
  "total": 5
}
```

**Prompt de Gemini usado:**
```
Busca N empresas reales en [CIUDAD], Región de la Araucanía, Chile. La categoría es "[CAT]".
[Instrucciones específicas según categoría]
IMPORTANTE: El teléfono es OBLIGATORIO. Busca en Google Maps, páginas amarillas, guías locales.
Responde SOLO JSON: {"empresa","telefono","website","ubicacion","instagram","facebook","tiktok"}
```

### 3.2 `POST /api/leads/find-contact` ← **NUEVO, ACTIVO**

**Input:** `{ "lead_id": "uuid" }`

**Flujo:**
1. Obtiene el lead de la BD
2. Llama a Gemini con prompt enfocado en encontrar teléfono y redes de ESA empresa específica
3. Actualiza el lead con los datos encontrados

**Output:** `{ "success": true, "contacto": { "telefono": "...", "instagram": "...", "facebook": "...", "tiktok": "..." } }`

### 3.3 `GET /api/leads/list` ← **ACTIVO**

**Query params:** `?categoria=productoras&estado=nuevo&sector=lacustre&search=term`

Filtros:
- `categoria` — filtra por array `categorias` (cs = contains)
- `estado` — eq en `estado_lead`
- `sector` — eq en `sector`
- `search` — ILIKE en empresa o ubicacion

Orden: `created_at DESC`

### 3.4 `POST /api/leads/save` ← **LEGACY, poco uso**

Guarda o actualiza un lead manualmente (no usado por el flujo principal).

### 3.5 `POST /api/leads/analizar` + `/execute` ← **LEGACY**

Sistema antiguo de scoring con IA. Crea un job en `search_jobs`, dispara execute en background (fire-and-forget), actualiza score y guion del lead. Ya no se usa desde el dashboard (se eliminó columna Score y botón Calificar).

### 3.6 `GET /api/leads/job-status/[id]` ← **LEGACY**

Polling de jobs de búsqueda/análisis. Ya no se usa para búsqueda (ahora es sincrónica). Solo lo usa `analizar`.

### 3.7 `POST /api/outreach/log` ← **ACTIVO**

**Input:** `{ "lead_id": "uuid", "resultado": "contactado", "notas": "...", "nuevo_estado_lead": "contactado" }`

Inserta en tabla `outreach` y opcionalmente actualiza `estado_lead` del lead.

### 3.8 `GET /api/outreach/log?lead_id=uuid` ← **ACTIVO**

Devuelve historial de outreach para un lead, ordenado por fecha DESC.

---

## 4. FRONTEND — DASHBOARD

### Layout: 2 columnas (sidebar + tabla)

**Panel lateral (sidebar):**
- Select Categoría: Productoras / Corporativo / Bodas / Cumpleaños / Municipal
- Select Sector: 6 sectores de la Araucanía
- Select Ciudad: ciudades del sector seleccionado
- Input Cantidad (1-20)
- Botón "Buscar Leads" (llama a `POST /api/leads/search`)
- Estado de búsqueda (buscando/completado/error)
- Lista de leads encontrados en la última búsqueda

**Tabla (7 columnas):**

| Columna | Contenido |
|---------|-----------|
| **Empresa** | Nombre + teléfono + link web |
| **Sector** | Label del sector (ej: "Zona Lacustre") |
| **Categoría** | Emoji + nombre |
| **Ciudad** | Ubicación |
| **Redes** | Iconos clickeables: Instagram (rosa), Facebook (azul), TikTok (cyan) |
| **Estado** | Chip clickeable → abre OutreachModal |
| **Contacto** | Botón web (ámbar) + WhatsApp (verde, si hay teléfono) o "Buscar contacto" (azul) |

**Filtros superiores:**
- Búsqueda por texto (empresa o ubicación)
- Chips de categoría: Todas / Productoras / Corporativo / Bodas / Cumpleaños / Municipal
- Chips de sector: Todos / Temuco / Lacustre / Sur / Costa / Norte / Lagos
- Chips de estado: Todos / Nuevo / En Proceso / Contactado / Agendado / Descartado

### Estructura de datos de los sectores (6 zonas de la Araucanía):

```typescript
const sectoresAraucania = {
  temuco:    { label: 'Temuco y alrededores', ciudades: ['Temuco','Padre Las Casas','Vilcún','Freire','Pitrufquén','Nueva Imperial','Cholchol','Galvarino'] },
  lacustre:  { label: 'Zona Lacustre',        ciudades: ['Villarrica','Pucón','Lican Ray','Caburgua','Curarrehue','Coñaripe'] },
  sur:       { label: 'Zona Sur',             ciudades: ['Loncoche','Gorbea','Toltén','Teodoro Schmidt'] },
  costa:     { label: 'Costa Araucanía',      ciudades: ['Carahue','Puerto Saavedra'] },
  norte:     { label: 'Zona Norte (Malleco)', ciudades: ['Victoria','Curacautín','Lautaro','Collipulli','Angol','Lonquimay'] },
  lagos:     { label: 'Zona Lagos',           ciudades: ['Panguipulli','Lanco','Mariquina'] },
}
```

### Flujo de búsqueda (handleStartSearch):

1. Usuario selecciona categoría + sector + ciudad + cantidad → click "Buscar Leads"
2. Frontend muestra "Buscando [cat] en [ciudad]..."
3. `POST /api/leads/search` → espera respuesta completa (12-70s según ubicación)
4. Si ok: muestra lista de encontrados en sidebar + resalta filas nuevas en tabla (borde ámbar)
5. Si error: muestra mensaje en rojo

### Flujo "Buscar contacto" (handleFindContact):

1. Lead sin teléfono → columna Contacto muestra botón azul "Buscar contacto"
2. Click → `POST /api/leads/find-contact` → Gemini busca teléfono de esa empresa
3. Actualiza el lead → aparece botón WhatsApp

### Flujo de outreach:

1. Click en estado del lead → abre OutreachModal
2. Seleccionar resultado (pendiente/contactado/respondió/agendado/rechazo) + notas
3. Guarda → `POST /api/outreach/log` + actualiza estado

---

## 5. VARIABLES DE ENTORNO (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://hqpmmlrtqruoaptwzjbs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
GEMINI_API_KEY=AQ....
RESEND_API_KEY=re_...
MP_ACCESS_TOKEN=TEST-...
```

---

## 6. LO QUE SE ELIMINÓ (respecto a versión anterior)

- ❌ **Scoring IA** — columna Score, botón "Calificar", polling de análisis, badge de score
- ❌ **Fire-and-forget** — la búsqueda ya no usa jobs/polling, es sincrónica directa
- ❌ **AbortController** con timeout — causaba que búsquedas en ciudades chicas fallaran
- ❌ **Guion WhatsApp** generado por IA (el mensaje ahora es fijo, simple y directo)

## 7. LO QUE SE AGREGÓ (nuevo)

- ✅ **Sector** — 6 zonas geográficas de la Araucanía, dropdown + filtro en tabla
- ✅ **Redes sociales** — columnas instagram, facebook, tiktok en BD + iconos clickeables
- ✅ **find-contact** — endpoint dedicado a buscar teléfono de un lead sin datos
- ✅ **Resultados visibles** — panel "Encontrados" en sidebar + filas resaltadas
- ✅ **Website como contacto** — botón web visible en columna Contacto
- ✅ **Prompt mejorado** — teléfono como campo OBLIGATORIO, búsqueda en Google Maps, páginas amarillas
- ✅ **Categoría "cumpleaños"** — 🎂 Cumpleaños / Celebraciones (salones, quintas, fiestas infantiles)

## 8. FLUJO COMPLETO DE VENTA

```
1. Alberto abre /dashboard
2. Selecciona: 🎂 Cumpleaños → Zona Lacustre → Villarrica → 10 leads
3. Click "Buscar Leads" → 12-30s → 5 empresas encontradas
4. Revisa la tabla: ve empresas, sectores, redes sociales
5. Lead con Instagram → click en ícono → abre perfil, manda DM
6. Lead con WhatsApp → click en botón verde → abre wa.me con mensaje pre-armado
7. Lead SIN teléfono → click "Buscar contacto" → Gemini busca → aparece WhatsApp
8. Hizo contacto → click en estado → "Contactado" → guarda en outreach
9. Siguiente lead → repite
```

---

## 9. COMANDOS

```bash
# Desarrollo
cd "D:\Proyectos Antigravity\parquehipico\parquehipico-nextjs"
npm run dev
# Abrir http://localhost:3000/dashboard

# Git
git push origin main
# Repo: https://github.com/weareleit-sys/parquehipico
```

---

## 10. CONFIGURACIÓN DE GEMINI

- **Modelo:** `gemini-2.5-flash`
- **Grounding:** `tools: [{ google_search: {} }]` — búsqueda en tiempo real en Google
- **API Key:** en `.env.local` como `GEMINI_API_KEY`
- **Spending cap:** administrado en https://ai.studio/spend (proyecto 506030967603)
- **Costo estimado:** ~$15 CLP por lead encontrado (varía según Grounding)
