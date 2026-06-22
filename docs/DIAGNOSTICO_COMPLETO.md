# DIAGNÓSTICO COMPLETO — Sistema de Leads Parque Hípico La Montaña
## 11 Junio 2026 · 85/100 · 137 leads activos

---

## MAPA VISUAL DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR (Alberto)                         │
│  https://parquehipico.vercel.app/dashboard?token=xxx               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│  MIDDLEWARE (middleware.ts · 27KB)                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ¿Es localhost? → PERMITIR                                   │   │
│  │ ¿Tiene ?token= o Authorization: Bearer? → PERMITIR          │   │
│  │ ¿No? → 401                                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
│ /dashboard  │  │ /api/leads/* │  │ /api/outreach/*  │
│ (SSR page)  │  │ (7 endpoints)│  │ (1 endpoint)     │
└──────┬──────┘  └──────┬───────┘  └───────┬──────────┘
       │                │                   │
       ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  DashboardClient.tsx (137 líneas)                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │
│  │useLeads  │  │useSearch │  │useOutreach│  │  viewMode state   │   │
│  │filters   │  │form      │  │findContact│  │  table │ cards    │   │
│  │page      │  │phases    │  │logOutreach│  │                    │   │
│  │fetchLeads│  │stats     │  │           │  │                    │   │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └──────────────────┘   │
│       │              │              │                                │
│       ▼              ▼              ▼                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    COMPONENTES DE UI                         │   │
│  │  SearchPanel  │ FilterBar │ LeadsTable │ LeadCardView       │   │
│  │  (sidebar)    │ (chips)   │ (sort+pag) │ (grid tarjetas)    │   │
│  │               │           │            │                    │   │
│  │  LeadRow      │ LeadCard  │ GuionModal │ OutreachModal      │   │
│  │  (fila tabla) │ (tarjeta) │ (mensaje)  │ (seguimiento)      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
       │                │                   │
       ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     API ENDPOINTS (service_role)                     │
│                                                                     │
│  🔍 /api/leads/search      POST  → Gemini Grounding + guardar       │
│  📋 /api/leads/list        GET   → Paginado + filtros + outreach    │
│  📊 /api/leads/stats       GET   → Métricas + conversión            │
│  ✏️ /api/leads/save        POST  → Guardar/editar (parcial)         │
│  📱 /api/leads/find-contact POST → Buscar teléfono/email/redes      │
│  ✨ /api/leads/generar-guion POST → Guion personalizado con Grounding│
│  ✅ /api/leads/verify       POST → Verificar 1 lead                  │
│  🔄 /api/leads/verify-missing POST→ Verificar leads sin verificar   │
│  📝 /api/outreach/log      POST  → Registrar contacto               │
│  📝 /api/outreach/log      GET   → Historial por lead               │
│  🔑 /api/auth/login        POST  → Login (cookie session)           │
│  🚪 /api/auth/logout       POST  → Logout                           │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│              LIBRERÍAS COMPARTIDAS (app/lib/)                        │
│                                                                     │
│  supabase.ts          → getSupabaseAdmin() + getSupabase()          │
│  rate-limit.ts        → checkRateLimit() · 10/5min · PG function    │
│  lead-categories.ts   → 8 categorías tipadas · normalize()          │
│  lead-links.ts        → cleanWebsite() · cleanSocialHandle()        │
│  lead-verification.ts → verifyLeadData() · Google Places · 777 líneas│
│  auth-session.ts      → Manejo de sesión con cookies                │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   SUPABASE (PostgreSQL)                              │
│                                                                     │
│  Tablas:                                                            │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │ leads    │ │ outreach │ │ search_jobs │ │ rate_limits │         │
│  │ 137 reg  │ │ 15 reg   │ │ ~20 reg     │ │ variable    │         │
│  │ 23 cols  │ │ 8 cols   │ │ 9 cols      │ │ 4 cols      │         │
│  └──────────┘ └──────────┘ └─────────────┘ └─────────────┘         │
│                                                                     │
│  RLS: CERRADA · solo service_role                                   │
│  Índices: categoria, estado, sector, telefono UNIQUE, score, GIN    │
│  Funciones PG: check_rate_limit() · atómica                         │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   GEMINI 2.5 FLASH (Google AI)                       │
│                                                                     │
│  Modelo: gemini-2.5-flash                                           │
│  Tools: google_search (Grounding)                                   │
│  Timeout: 45s backend · 50s frontend                                │
│  Rate limit: 10 búsquedas/5min por IP                               │
│  Spending cap: proyecto 506030967603                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## DIAGRAMA DE FLUJO — BÚSQUEDA DE LEADS

```
Usuario → SearchPanel → useSearch.handleStartSearch()
  │
  ├─ 1. POST /api/leads/search {categoria, ubicacion, sector, limit}
  │     │
  │     ├─ Rate limit check (check_rate_limit PG function)
  │     │
  │     ├─ Construye prompt con lead-categories.ts
  │     │   └─ getLeadCategoryDefinition(categoria).searchPrompt
  │     │
  │     ├─ Gemini 2.5 Flash + google_search (45s timeout)
  │     │   └─ Si timeout → 504 "Probá con menos resultados"
  │     │
  │     ├─ Parsea JSON · limpia Markdown
  │     │
  │     ├─ Valida cada lead:
  │     │   ├─ normalizePhone() · isWhatsAppCompatible()
  │     │   ├─ cleanWebsite() · cleanSocialHandle()
  │     │   ├─ Dedup: nombre normalizado + teléfono
  │     │   └─ Upsert en BD con service_role
  │     │
  │     └─ Response: {leads, stats, remaining_searches}
  │
  ├─ 2. Frontend recibe resultados
  │     ├─ SearchPanel muestra "Encontrados" + stats
  │     ├─ newLeads se marcan para highlight
  │     └─ fetchLeads() actualiza tabla/tarjetas
  │
  └─ 3. Usuario ve resultados en tabla o tarjetas
```

---

## DIAGRAMA DE FLUJO — CONTACTO CON LEAD

```
Usuario ve lead en tabla/tarjeta
  │
  ├─ ¿Tiene teléfono?
  │   ├─ SÍ → Botón WhatsApp (verde)
  │   │   └─ Click → wa.me/+569...?text=... + log outreach
  │   │       └─ POST /api/outreach/log {lead_id, resultado:"contactado"}
  │   │
  │   └─ NO → Botón "Buscar contacto" (azul)
  │       └─ POST /api/leads/find-contact {lead_id}
  │           └─ Gemini Grounding busca teléfono/email/redes
  │               └─ Actualiza lead · aparece WhatsApp
  │
  ├─ ¿Tiene website?
  │   └─ Botón "Mensaje" (morado) → GuionModal
  │       └─ POST /api/leads/generar-guion {lead_id}
  │           └─ Gemini con Grounding investiga web
  │               └─ Devuelve {perfil, guion} personalizado
  │                   └─ Usuario edita/regenera → guarda
  │                       └─ WhatsApp usa guion personalizado
  │
  └─ ¿Respondieron?
      └─ Click en estado → OutreachModal
          └─ Cambia a "respondió"/"agendado"/"rechazo"
              └─ POST /api/outreach/log con respuesta_fecha
```

---

## DIAGRAMA DE ESTADO DE LEADS

```
        ┌─────────┐
        │  NUEVO  │ ←── 118 leads (86%)
        │  🔵     │
        └────┬────┘
             │ Se envía WhatsApp
             ▼
        ┌──────────┐
        │CONTACTADO│ ←── 11 leads (8%)
        │   🟡     │
        └────┬─────┘
             │ Responden
             ▼
        ┌──────────┐
        │RESPONDIÓ │ ←── 1 lead (desde outreach BD)
        │   🟢     │
        └────┬─────┘
             │ Agendan reunión
             ▼
        ┌──────────┐
        │ AGENDADO │ ←── 0 leads
        │   🟣     │
        └──────────┘

        ┌───────────┐
        │ RECHAZO   │ ←── 0 leads
        │    🔴     │
        └───────────┘

        ┌────────────┐
        │ DESCARTADO │ ←── 6 leads (4%)
        │    ⚪      │
        └────────────┘
```

---

## MAPA DE CATEGORÍAS (8)

```
┌──────────────────────────────────────────────────────┐
│  🎪 productoras    19 leads (14%)                    │
│  🏢 corporativo    25 leads (18%)  ← más buscada     │
│  💒 matrimonios    13 leads (9%)                     │
│  🎉 cumpleanos     27 leads (20%)  ← más leads       │
│  🌲 turismo        18 leads (13%)                    │
│  🎓 educacion      14 leads (10%)                    │
│  🏛️ municipal      12 leads (9%)                     │
│  🤝 comunidad       9 leads (7%)                     │
└──────────────────────────────────────────────────────┘
```

---

## MAPA DE SECTORES GEOGRÁFICOS

```
┌────────────────────────────────────────────────┐
│  temuco      ──▸ Temuco, Padre Las Casas,      │
│                  Vilcún, Freire, Pitrufquén,    │
│                  Nva Imperial, Cholchol,        │
│                  Galvarino                       │
│                                                 │
│  lacustre    ──▸ Villarrica, Pucón, Lican Ray, │
│                  Caburgua, Curarrehue, Coñaripe │
│                                                 │
│  norte       ──▸ Victoria, Curacautín, Lautaro, │
│                  Collipulli, Angol, Lonquimay   │
│                                                 │
│  sur         ──▸ Loncoche, Gorbea, Toltén,     │
│                  Teodoro Schmidt                 │
│                                                 │
│  costa       ──▸ Carahue, Puerto Saavedra      │
│                                                 │
│  lagos       ──▸ Panguipulli, Lanco, Mariquina │
│                                                 │
│  externo     ──▸ Fuera de la Araucanía          │
└────────────────────────────────────────────────┘
```

---

## MAPA DE TAMAÑOS DE ARCHIVOS (líneas)

```
Código backend (API + libs):
  search/route.ts           ████████████████████████ 826 ⚠️ MÁS GRANDE
  lead-verification.ts      ████████████████████ 777
  generar-guion/route.ts    ███ 115
  lead-categories.ts        █████ 168
  lead-links.ts             ████ 157
  find-contact/route.ts     ████ 140
  stats/route.ts            ███ 160
  save/route.ts             ██ 86
  list/route.ts             ██ 80
  rate-limit.ts             █ 35
  supabase.ts               █ 28
  auth-session.ts           ██ 81

Frontend:
  DashboardClient.tsx       ████ 160
  LeadCard.tsx              ██████ 240
  LeadRow.tsx               █████ 200
  SearchPanel.tsx           ██████ 245
  LeadsTable.tsx            ████ 135
  FilterBar.tsx             ███ 127
  GuionModal.tsx            █████ 215
  useSearch.ts              ███ 130
  useLeads.ts               ██ 95
  useOutreach.ts            ██ 65
  LeadCardView.tsx          █ 55
```

---

## ESTADO DE SALUD POR COMPONENTE

```
✅ VERDE — Funcionando correctamente
🟡 AMARILLO — Funciona pero tiene deuda técnica
🔴 ROJO — Necesita atención

✅ middleware.ts          — Auth sólido, Bearer + URL token
✅ rate-limit.ts          — PG function atómica, 10/5min
✅ lead-categories.ts     — 8 categorías tipadas, bien diseñado
✅ lead-links.ts          — Helpers extraídos, limpios
✅ lead-verification.ts   — 777 líneas, Google Places, robusto
✅ auth-session.ts        — Login/logout real
✅ supabase.ts            — Dual client correcto
✅ DashboardClient.tsx    — Orquestador limpio, 160 líneas
✅ LeadCard.tsx           — Tarjeta bien diseñada, 240 líneas
✅ GuionModal.tsx         — Auto-generación, edición, warning
✅ OutreachModal.tsx      — Seguimiento con token
✅ useLeads/useSearch/useOutreach — Hooks limpios
✅ SearchPanel.tsx        — Sidebar completo, fases, stats
✅ FilterBar.tsx          — Chips categoría/sector/estado
✅ LeadsTable.tsx         — Sort + paginación
✅ LeadCardView.tsx       — Grid tarjetas
✅ RLS (Supabase)         — Cerrada, solo service_role
✅ Build                  — Pasa limpio

🟡 search/route.ts        — 826 líneas, monolito backend
🟡 stats/route.ts         — Métricas OK, sin cache
🟡 generar-guion/route.ts — Funciona, 2 reintentos, OK
🟡 Token en URL           — Funciona pero visible en logs
🟡 0 respuestas outreach  — 15 contactos, 1 respondió
🟡 Sin CI/CD              — Deploy manual
🟡 Sin tests              — 0 tests automatizados

🔴 NINGUNO — No hay bloqueantes
```

---

## MÉTRICAS DE CONVERSIÓN (actual)

```
137 leads ──► 115 con teléfono (84%)
            ──► 98 con website (72%)
            ──► 94 con email (69%)
            ──► 46 con guion (34%)

15 outreach ──► 14 contactado (93%)
             ──► 1 respondió (7%)
             ──► 0 agendados
             ──► 0 rechazos
             ──► 0 con respuesta_fecha (campo nuevo)

Tasa de respuesta: 7% (1/15)
Tasa de conversión: 0% (0 agendados)
```

---

## QUÉ HACER AHORA (LAS 3 COSAS DE HOY)

### 1. Deploy a Vercel (15 min)
```
Repo: weareleit-sys/parquehipico
Root: web
Vars: DASHBOARD_TOKEN, SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
      GEMINI_API_KEY, RESEND_API_KEY, MP_ACCESS_TOKEN
Resultado: https://parquehipico.vercel.app/dashboard?token=xxx
```

### 2. Migrar token a cookie (30 min)
- En POST /api/auth/login: `Set-Cookie: session=xxx; HttpOnly; Secure; SameSite=Strict`
- Middleware: leer cookie en vez de `?token=` (con fallback a URL para compatibilidad)
- `apiFetch()`: ya usa Bearer header, no necesita cambios

### 3. Verificación en búsqueda (15 min)
- Agregar `verify=true` param a POST /api/leads/search
- Si `verify=true`, después de guardar cada lead, llamar `verifyLeadData()` en background
- Guardar resultado en `raw_data.verification`
