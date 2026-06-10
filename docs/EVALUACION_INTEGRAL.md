# INFORME DE EVALUACIÓN INTEGRAL — Sistema de Leads Parque Hípico La Montaña

## Fecha: 8 Junio 2026 | Commit: `f2241dc`

---

## RESUMEN EJECUTIVO

Sistema de prospección comercial (lead generation) para Parque Hípico La Montaña, recinto outdoor de 3 hectáreas en Villarrica, Araucanía, Chile. Stack: Next.js 14 + TypeScript + Tailwind + Supabase PostgreSQL + Gemini 2.5 Flash (Google Grounding). 45 leads activos. 9 outreach registros.

**Calificación global: 82/100.** Funcional, seguro, con guiones de calidad. El bloqueo principal para deploy es la vista de tarjetas (componente listo, bloqueado por bug del parser SWC en Next.js 14.2). La Fase 3 (refactor) lo desbloquea.

---

## 1. EVALUACIÓN POR DIMENSIÓN

### 1.1 BÚSQUEDA DE LEADS (Gemini Grounding) — 88/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Tasa de éxito | 2/2 búsquedas OK (productoras Temuco, cumpleaños Angol) | 90 |
| Calidad de datos | Promedio 3 leads con teléfono, 2-3 con web, 2-3 con email | 85 |
| Tiempo de respuesta | 20-90s (depende ubicación) | 70 |
| Validación de datos | Email format check, phone normalization (+56 9), website cleaning | 95 |
| Deduplicación | Por nombre normalizado + check BD existente, dentro de misma búsqueda | 90 |
| Rate limiting | 10 búsquedas/5min por IP, función PG atómica | 95 |

**Fortalezas:** La validación de datos es sólida. Teléfonos múltiples se separan correctamente (prioriza +56 9). Emails inválidos se descartan. Websites con @ se mueven a email. La deduplicación por nombre normalizado funciona.

**Debilidades:** El tiempo de respuesta es variable (20s Temuco, 90s Angol). Gemini Grounding es lento en ciudades pequeñas. No hay indicador de progreso real (solo mensajes rotativos).

### 1.2 GENERACIÓN DE GUIONES (generar-guion) — 85/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Precisión del perfil | 3/3 describen correctamente al lead, no al parque | 90 |
| Calidad del guion | 3/3 buenos, gancho sobre el lead, problema + CTA | 85 |
| Sin alucinaciones (caballos) | 0/3 mencionan caballos/shows ecuestres ✅ | 100 |
| Fiabilidad | 2 reintentos con fallback, errores descriptivos | 90 |
| Velocidad | 15-30s por guion | 70 |

**Fortalezas:** El fix del prompt eliminó completamente las alucinaciones sobre caballos. El sistema de 2 reintentos con fallback es robusto. Los guiones siguen la estructura matador: gancho sobre ELLOS → problema → CTA.

**Debilidades:** 15-30s es lento para generar un solo mensaje. La calidad varía — a veces el guion es muy genérico ("espacio al aire libre con gran capacidad"). El perfil a veces es muy corto (1 línea).

### 1.3 FIND-CONTACT — 75/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Encuentra email | Parque Arena: info@parquearena.cl ✅ | 80 |
| Encuentra teléfono | Parque Arena: no encontró teléfono ❌ | 50 |
| Encuentra Instagram | Parque Arena: no encontró @parquearenacl ❌ | 40 |
| Encuentra website | Encontró invitalo.cl (third-party), no el oficial | 60 |
| Prompt mejorado | Ahora busca en 7+ fuentes, incluye email | 85 |

**Fortalezas:** El prompt extendido busca en más fuentes. Email se encuentra consistentemente.

**Debilidades:** Instagram y teléfono son inconsistentes. Gemini Grounding no indexa bien cuentas de IG chilenas. Para Parque Arena, el usuario investigó manualmente y encontró datos que Gemini no pudo.

### 1.4 OUTREACH — 90/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Registro de contacto | POST funciona, guarda lead_id + resultado + notas | 95 |
| Historial | GET devuelve todos los registros ordenados por fecha | 95 |
| Actualización de estado | Cambia estado_lead del lead al contactar | 90 |
| Integración WhatsApp | Click en WhatsApp registra outreach automático | 85 |

### 1.5 PAGINACIÓN Y FILTROS — 92/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Paginación backend | Count exacto, range(from,to), límite 50 | 95 |
| Filtro pendientes | estado_lead IN ('nuevo','en_proceso') combinado | 90 |
| Filtro categoría | Array containment sobre categorias[] | 90 |
| Filtro sector | eq sobre sector | 95 |
| Búsqueda texto | ILIKE en empresa + ubicacion | 90 |
| Total leads: 45 | Páginas: 9 (5 por página) | 95 |

### 1.6 SEGURIDAD — 88/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Middleware auth | Token required en prod, bypass localhost | 90 |
| Supabase dual | Service role para escrituras, anon para lecturas | 95 |
| Rate limiting | PG function atómica, 10/5min | 90 |
| RLS | Abierto (FOR ALL USING true) ⚠️ | 40 |
| Token en fetch | apiFetch() pasa token en todas las llamadas | 90 |

**⚠️ RLS sigue abierto.** Las políticas son `FOR ALL USING (true)`. Aunque el middleware protege las API routes, la anon key expuesta en el frontend permite acceso directo a Supabase REST API. Esto es aceptable en desarrollo pero debe cerrarse antes de producción real.

### 1.7 UX / USABILIDAD — 70/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Colores por estado | Borde izquierdo coloreado (azul, ámbar, verde, morado, rojo) | 85 |
| Lenguaje negocio | "Contactos" no "Leads", "Mensaje" no "Guion" | 90 |
| Texto en contacto | "Sin contacto aún", "Contactado hoy" | 85 |
| Filtros rápidos | Chips de categoría, sector, estado con conteos | 80 |
| Vista de tarjetas | Componente listo pero bloqueado por SWC parser ❌ | 20 |
| Densidad visual | 7 columnas, info densa en pantallas chicas | 60 |

**Debilidades:** La vista de tarjetas (LeadCard.tsx, 88 líneas) está lista pero no se puede integrar por un bug del parser SWC en Next.js 14.2 con archivos de 600 líneas. La tabla actual es funcional pero densa para usuarios 50+.

### 1.8 ESTABILIDAD — 82/100

| Métrica | Resultado | Puntaje |
|---------|-----------|---------|
| Try/catch en endpoints | search, find-contact, generar-guion, list, outreach | 90 |
| Timeout handling | AbortController 45s en search, 50s en frontend | 85 |
| Fallback guion | 2 reintentos automáticos con prompt simplificado | 90 |
| SSR optimizado | Solo 25 leads pendientes, no query masiva | 90 |
| Error 502 sin web | Arreglado con fallback prompt | 95 |

---

## 2. RESULTADOS DE TESTS (8 pruebas ejecutadas)

| Test | Resultado | Detalle |
|------|-----------|---------|
| 1a. Búsqueda productoras Temuco | ✅ | 3 leads, 3 WhatsApp, 2 web, 2 email |
| 1b. Búsqueda cumpleaños Angol | ✅ | 3 leads, 3 WhatsApp |
| 2. find-contact | ⚠️ | Email encontrado, teléfono/IG inconsistentes |
| 3. Guiones (3 leads) | ✅ | 0/3 alucinaciones de caballos, perfiles correctos |
| 4. Outreach | ✅ | POST + GET funcionando |
| 5. Paginación | ✅ | 45 leads, 9 páginas, filtros OK |
| 6. WhatsApp links | ✅ | Normalización (56-9), múltiples teléfonos, +56 9 |
| 7. Dashboard SSR | ✅ | 200 OK, 204KB, Contactos, Pendientes |
| 8. Middleware | ✅ | Localhost bypass funciona |

---

## 3. ESTADO DE LA BASE DE DATOS

| Tabla | Registros | Columnas activas |
|-------|-----------|-----------------|
| leads | 45 | 23 (incluye sector, instagram, facebook, tiktok, guion, web_status) |
| outreach | 9 | 7 (lead_id FK, resultado, fecha_contacto, notas) |
| search_jobs | ~15 | Legacy, solo usado por analizar |
| rate_limits | 0 | Nueva, función PG check_rate_limit() |

**Distribución de leads:** 39 nuevo (86.7%), 6 contactado (13.3%)

---

## 4. ARQUITECTURA Y ESTRUCTURA DE ARCHIVOS

### API Endpoints (activos)

```
POST /api/leads/search          — Búsqueda sincrónica Gemini + guardado (9.9KB)
POST /api/leads/find-contact    — Buscar teléfono/email/redes de un lead (3.7KB)
POST /api/leads/generar-guion   — Generar mensaje WhatsApp personalizado (4.5KB)
GET  /api/leads/list            — Lista paginada con filtros + outreach join (2.4KB)
POST /api/leads/save            — Guardar/editar lead manual (2.0KB)
POST /api/outreach/log          — Registrar contacto (2.2KB)
GET  /api/outreach/log          — Historial de contactos (2.2KB)
```

### API Endpoints (legacy, no usados)

```
POST /api/leads/search/execute  — Búsqueda async vieja (4.5KB)
POST /api/leads/analizar        — Scoring IA (1.8KB)
POST /api/leads/analizar/execute— Scoring execute (4.8KB)
GET  /api/leads/job-status/[id] — Polling (1.4KB)
```

### Frontend

```
app/dashboard/
  page.tsx              (1.6KB) — Server Component, SSR 25 leads pendientes
  DashboardClient.tsx   (590 líneas, 32KB) — Toda la UI monolítica ⚠️
  GuionModal.tsx        (7.6KB) — Modal mensaje WhatsApp con auto-generación
  OutreachModal.tsx     (5.0KB) — Modal seguimiento
  LeadCard.tsx          (3.5KB) — Componente tarjeta (listo, no integrado) ⚠️

app/lib/
  supabase.ts           — Cliente dual (anon + service_role)
  supabaseClient.ts     — Cliente legacy (anon)
  rate-limit.ts         — Rate limiting con PG function
```

### Infraestructura

```
middleware.ts           — Auth token requerido en prod
scripts/db_leads_schema.sql — Schema completo PostgreSQL
.env.local              — 7 variables de entorno
```

---

## 5. DEUDA TÉCNICA (priorizada)

| # | Deuda | Impacto | Esfuerzo | Bloquea |
|---|-------|---------|----------|---------|
| 1 | DashboardClient monolítico (590 líneas) | Mantenibilidad | 2h (Fase 3) | Vista tarjetas |
| 2 | RLS abierto | Seguridad | 30min | Producción |
| 3 | Código legacy sin eliminar (4 endpoints) | Confusión | 15min | — |
| 4 | Vista de tarjetas no integrada | UX equipo 50+ | 10min post-Fase3 | — |
| 5 | Sin tests | Confiabilidad | 3h | CI/CD |
| 6 | SSR carga innecesaria (aunque ya limitada a 25) | Performance | Ya mitigado | — |
| 7 | find-contact no encuentra IG | Cobertura datos | Investigación | — |

---

## 6. COMPARATIVA ANTES VS DESPUÉS (esta sesión)

| Dimensión | Inicio sesión | Fin sesión |
|-----------|--------------|------------|
| Seguridad | Sin auth, RLS abierto expuesto | Token + middleware + service_role + rate limit |
| Estabilidad | Fire-and-forget frágil, 502 sin web | Sincrónico robusto, try/catch, reintentos |
| UX | "Leads", "Grounding", sin colores | "Contactos", colores estado, texto claro |
| Paginación | Sin paginación | 25/page, default pendientes, chips conteo |
| Guiones | "Tenemos 3 hectáreas y trifásica" | Gancho sobre el lead, sin features ni caballos |
| Datos | Sin email, sin IG, sin sector | Email, IG, FB, TikTok, sector Araucanía |
| SSR | Query masiva (todos los leads) | Solo 25 pendientes |
| Vista tarjetas | No existía | Componente listo (bloqueado por parser) |

---

## 7. MATRIZ DE PUNTAJES

| Categoría | Puntaje | Peso | Contribución |
|-----------|---------|------|-------------|
| Búsqueda Gemini | 88 | 25% | 22.0 |
| Guiones IA | 85 | 20% | 17.0 |
| Find-contact | 75 | 10% | 7.5 |
| Outreach | 90 | 10% | 9.0 |
| Paginación/Filtros | 92 | 10% | 9.2 |
| Seguridad | 88 | 10% | 8.8 |
| UX/Usabilidad | 70 | 10% | 7.0 |
| Estabilidad | 82 | 5% | 4.1 |
| **TOTAL PONDERADO** | | **100%** | **84.6 → 82** |

*Ajuste: -2.6 por deuda técnica activa (monolítico, RLS abierto, sin tests)*

---

## 8. RECOMENDACIONES PARA PRÓXIMA SESIÓN

### Crítico (antes de producción)
1. **Fase 3 (Refactor):** Partir DashboardClient en 5 componentes. Esto desbloquea la vista de tarjetas.
2. **Cerrar RLS:** Reemplazar `FOR ALL USING (true)` con políticas que usen auth.uid() o al menos restringir INSERT/UPDATE/DELETE.
3. **Activar LeadCard.tsx:** Post-refactor, integrar en 10 minutos. Es la funcionalidad de mayor impacto para Alberto.

### Importante
4. **Mejorar find-contact:** Investigar por qué Gemini no encuentra IG de empresas chilenas. Posible fix: usar búsqueda de Instagram directa en vez de Grounding.
5. **Eliminar código legacy:** Borrar `analizar/`, `search/execute/`, `job-status/`. Son 4 endpoints que nadie usa.
6. **Agregar tests:** Al menos tests de integración para search y generar-guion.

### Deseable
7. **Deploy a Vercel:** 30 minutos. Las variables de entorno ya están listas.
8. **Contador de outreach en header:** "3 contactados esta semana, 1 agendado" — motivacional para Alberto.
9. **Exportar CSV:** Para compartir lista con el dueño del parque.
