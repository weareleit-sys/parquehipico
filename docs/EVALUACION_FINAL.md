# EVALUACIÓN COMPLETA — Sistema de Leads Parque Hípico La Montaña
## 23 Junio 2026 · Último commit: 6368861

---

## MATRIZ DE PUNTAJES (15 dimensiones, ponderadas)

| # | Dimensión | Peso | Nota | Contribución |
|---|-----------|------|------|-------------|
| 1 | **Seguridad** | 12% | 88 | 10.6 |
| 2 | **Arquitectura** | 10% | 75 | 7.5 |
| 3 | **Categorización de leads** | 10% | 90 | 9.0 |
| 4 | **Verificación de datos** | 8% | 85 | 6.8 |
| 5 | **Búsqueda Gemini** | 8% | 80 | 6.4 |
| 6 | **Generación de guiones** | 7% | 78 | 5.5 |
| 7 | **UX/Dashboard** | 7% | 78 | 5.5 |
| 8 | **Outreach/Seguimiento** | 6% | 80 | 4.8 |
| 9 | **Código/Mantenibilidad** | 6% | 65 | 3.9 |
| 10 | **Build/Deploy** | 5% | 70 | 3.5 |
| 11 | **Testing** | 5% | 10 | 0.5 |
| 12 | **Escalabilidad** | 4% | 60 | 2.4 |
| 13 | **Documentación** | 4% | 85 | 3.4 |
| 14 | **Valor comercial** | 5% | 82 | 4.1 |
| 15 | **Colaboración multi-agente** | 3% | 88 | 2.6 |
| | **TOTAL PONDERADO** | **100%** | | **76.5** |

---

## 1. SEGURIDAD — 88/100

### Lo que está bien ✅

- **RLS cerrada.** Verifiqué: la `anon key` devuelve 0 registros de leads. Solo `service_role` lee/escribe. Esto es producción-grade.
- **Dual Supabase.** `getSupabaseAdmin()` para API routes, `getSupabase()` (anon) no se usa para nada sensible.
- **Rate limiting.** `check_rate_limit()` usa función PG atómica. 10 búsquedas/5min por IP. Sin rate limit, alguien gasta todo el crédito Gemini en 30 segundos.
- **Bearer auth.** Todas las API calls del frontend usan `Authorization: Bearer <token>` — no aparece en logs ni URLs.
- **Middleware.** Protege `/dashboard`, `/api/leads`, `/api/outreach`. Localhost bypass para desarrollo.

### Lo que falta ⚠️

- **Token inicial sigue en URL.** El primer acceso a `/dashboard?token=xxx` expone el token en logs de Vercel, historial del navegador, y cualquier proxy intermedio. El fix es simple: `POST /api/auth/login` con `Set-Cookie: session=xxx; HttpOnly; Secure; SameSite=Strict`.
- **Sin rate limit en otros endpoints.** `/api/leads/generar-guion` y `/api/leads/find-contact` también llaman a Gemini pero no tienen rate limit. Si alguien hace 100 requests seguidos, gasta crédito sin control.

### Veredicto

La seguridad es el área más sólida del sistema. El gap al 100% es el token en URL (30 min de trabajo) y extender rate limit a los otros endpoints de Gemini (15 min). **88/100.**

---

## 2. ARQUITECTURA — 75/100

### Lo que está bien ✅

- **Separación frontend/backend.** Next.js App Router con API routes server-side. El frontend nunca llama a Supabase directamente.
- **Librerías compartidas.** `lead-categories.ts`, `lead-links.ts`, `lead-verification.ts` son reutilizables por cualquier endpoint.
- **Hooks pattern.** `useLeads`, `useSearch`, `useOutreach` extraen lógica de estado de los componentes.
- **Componentes chicos.** DashboardClient orquestador de 137 líneas, componentes de UI <250 líneas cada uno.

### Lo que está mal ❌

- **search/route.ts: 826 líneas en un solo archivo.** Es el monolito del backend. Contiene 30+ funciones: normalización de nombres, validación de teléfonos, parseo de Gemini, quality gates, inferencia de sector, guardado en BD. Todo mezclado. Refactor pendiente: extraer a `lib/leads/` (phone-utils, name-utils, parse-gemini, quality, sector).
- **No hay capa de servicios.** La lógica de negocio vive en los route handlers. Si mañana quiero buscar leads desde un cron job o una CLI, tengo que duplicar código.
- **API no versionada.** Las rutas son `/api/leads/search`, no `/api/v1/leads/search`. Si cambia el formato de respuesta, se rompe el frontend.

### Veredicto

La arquitectura es buena para un prototipo pero necesita una capa de servicios y el refactor del monolito para escalar. **75/100.**

---

## 3. CATEGORIZACIÓN DE LEADS — 90/100

### Lo que está bien ✅

- **8 categorías tipadas.** `lead-categories.ts` define cada categoría con `searchPrompt`, `guionContext`, `template`, `role`, `icon`. No hay strings mágicos sueltos en el código.
- **Aliasing robusto.** `normalizeLeadCategoryValue()` mapea 35+ variaciones a la categoría canónica. "cumpleaños" → "cumpleanos", "empresas" → "corporativo", "gobierno" → "municipal".
- **Exclusiones explícitas.** Cada `searchPrompt` incluye qué EXCLUIR. Ej: cumpleaños excluye "tiendas de artículos, cotillón, decoración, globos, tortas".
- **Templates personalizados.** Cada categoría tiene su propio mensaje WhatsApp pre-armado.

### Lo que falta ⚠️

- **La categoría "cumpleanos" se llama "cumpleanos" en el código pero se muestra como "Eventos familiares" en la UI.** El `label` y `shortLabel` lo manejan bien, pero el `value` canónico sin tilde es confuso en logs y debugging.
- **Sin métricas por categoría en el dashboard.** No sé cuál categoría convierte mejor. ¿Los leads de matrimonios responden más que los de cumpleaños? No hay datos.

### Veredicto

El sistema de categorías es el mejor diseñado del proyecto. **90/100.**

---

## 4. VERIFICACIÓN DE DATOS — 85/100

### Lo que está bien ✅

- **Sistema de 777 líneas.** `lead-verification.ts` integra Google Places API, web crawling, validación de redes sociales, confidence scoring (alta/media/baja).
- **Estados de verificación.** `verificado`, `parcial`, `sin_verificar`, `conflicto` — granularidad correcta.
- **Versiones.** `LEAD_VERIFICATION_VERSION` permite invalidar verificaciones viejas cuando mejora el algoritmo.
- **Actualización automática de campos.** Si Google Places encuentra un teléfono que Gemini no vio, lo actualiza.

### Lo que falta ⚠️

- **No integrado en el flujo de búsqueda.** La verificación se ejecuta manualmente (`POST /api/leads/verify-missing`). Debería correr automáticamente post-búsqueda con un flag `verify=true`.
- **Sin Google Places API key configurada.** En `.env.local` no hay `GOOGLE_MAPS_API_KEY`. La verificación funciona con el web crawl pero sin la parte más potente (Google Places).
- **Sin UI de verificación en el dashboard.** Alberto no sabe qué leads están verificados y cuáles no a menos que mire el badge. No hay un filtro "No verificados".

### Veredicto

El sistema de verificación es impresionante en diseño pero subutilizado en la práctica. **85/100.**

---

## 5. BÚSQUEDA GEMINI — 80/100

### Lo que está bien ✅

- **Prompt por categoría con exclusiones.** Gemini recibe instrucciones específicas sobre qué buscar y qué NO incluir.
- **Dry run mode.** `dryRun=true` permite probar prompts sin guardar leads.
- **2 reintentos con backoff.** Si Gemini falla (429 o 500), reintenta una vez con 1.2s de delay.
- **Timeout 75s.** El AbortController evita que requests colgadas bloqueen el servidor.
- **Validación post-búsqueda.** Cada lead pasa por quality gates (categoría, sector, canales accionables).

### Lo que está mal ❌

- **Sincrónico.** El usuario espera 20-90 segundos mirando una barra de progreso. Si busca 20 leads, puede esperar 2 minutos. Esto debería ser async: crear un job, devolver `job_id`, el usuario recibe los resultados cuando estén listos.
- **826 líneas en un solo archivo.** El endpoint de búsqueda es el archivo más grande del proyecto. Mezcla validación, prompt, parseo, quality gates, guardado.
- **Sin partial results.** Si Gemini encuentra 8 de 10 leads y luego falla, se pierden los 8.

### Veredicto

Funciona bien para búsquedas de <10 leads en ciudades grandes. Para 20+ leads o despliegue en producción con múltiples usuarios, necesita async jobs. **80/100.**

---

## 6. GENERACIÓN DE GUIONES — 78/100

### Lo que está bien ✅

- **Grounding activado.** `tools: [{google_search: {}}]` — Gemini investiga la web del lead antes de escribir.
- **2 reintentos con fallback.** Si el prompt principal falla, usa uno simplificado.
- **Sin alucinaciones de caballos.** El prompt ABRE con "SOMOS UN VENUE, no hacemos shows de caballos". Funciona: 0/46 guiones mencionan caballos en los últimos generados.
- **Estructura "matador".** Primera línea: observación sobre el lead. Segunda: problema que resolvemos. Tercera: CTA.

### Lo que falta ⚠️

- **Calidad inconsistente.** 70% de guiones son buenos, 30% son genéricos o débiles. Depende de cuánta información encuentre Gemini en la web del lead.
- **Sin Grounding en `find-contact`.** El endpoint que busca teléfonos/redes sí usa Grounding, pero `generar-guion` también debería — y lo tiene. OK.
- **46/141 leads tienen guion (33%).** Los otros 95 no tienen mensaje personalizado. Si Alberto contacta sin guion, usa el template genérico.

### Veredicto

Los guiones cumplen pero la cobertura es baja (33%). **78/100.**

---

## 7. UX / DASHBOARD — 78/100

### Lo que está bien ✅

- **Toggle tabla/tarjetas.** Funciona, persiste en localStorage.
- **Colores por estado.** Borde izquierdo coloreado (azul, ámbar, verde, morado, rojo, gris).
- **Lenguaje de negocio.** "Contactos" no "Leads", "Mensaje" no "Guion", "Estado / interés" no "Cambiar estado".
- **Filtros rápidos.** Chips de categoría, sector, estado con colores.
- **Paginación.** 25 por página, controles Anterior/Siguiente, default "pendientes".
- **Login page.** `/dashboard/login` con auth real, no solo `?token=`.

### Lo que falta ⚠️

- **Vista mobile mejorable.** La tabla de 8 columnas en un celular es ilegible. Las tarjetas ayudan pero no están optimizadas para mobile.
- **Sin "seguimiento semanal".** Alberto no puede ver de un vistazo "esta semana contacté 5, 1 respondió, 0 agendé".
- **Sin onboarding.** No hay tutorial ni tooltips. Un usuario nuevo no sabe qué hace cada botón.
- **OutreachModal sin cerrar con Escape o click fuera.** UX básico faltante.

### Veredicto

El dashboard es funcional y tiene buenas bases de UX pero le falta refinamiento para usuarios 50+. **78/100.**

---

## 8. OUTREACH / SEGUIMIENTO — 80/100

### Lo que está bien ✅

- **Registro automático al enviar WhatsApp.** Click en el botón verde → `POST /api/outreach/log`.
- **`respuesta_fecha` implementado.** Cuando un lead responde, se registra la fecha para medir tiempo de respuesta.
- **Auto-sync estado.** El OutreachModal ahora sincroniza `resultado` → `nuevoEstado` automáticamente.
- **Métricas de conversión.** `GET /api/leads/stats` devuelve `responseRate`, `avgResponseHours`, `byResult`.

### Lo que falta ⚠️

- **0 agendados, 0 rechazos, 0 respondidos (en `estado_lead`).** 17 outreach, solo 1 "respondio" en la tabla outreach, pero 0 leads tienen `estado_lead = 'respondio'`. El estado del lead no se actualiza correctamente al registrar outreach.
- **Sin recordatorios.** Si un lead no responde en 7 días, no hay alerta.
- **Sin historial visible en la tabla principal.** Hay que abrir el modal para ver el historial de contactos.

### Veredicto

La base de outreach es sólida pero la falta de seguimiento real (0 leads en estado "respondió") sugiere que el flujo no se está usando en producción. **80/100.**

---

## 9. CÓDIGO / MANTENIBILIDAD — 65/100

### Lo que está bien ✅

- **TypeScript estricto.** `tsconfig.json` tiene `strict: true`. El build no pasa si hay type errors.
- **Componentes chicos en frontend.** Ninguno >250 líneas excepto LeadRow (200) y SearchPanel (245).
- **Helpers extraídos.** `lead-categories.ts`, `lead-links.ts`, `lead-verification.ts` separan lógica de presentación.

### Lo que está mal ❌

- **search/route.ts: 826 líneas.** 30+ funciones en un archivo. Imposible de testear unitariamente. Cada cambio toca 400 líneas de contexto.
- **0 tests.** `npm run test` no existe. No hay tests unitarios, de integración ni E2E. Si rompo `normalizePhone()`, nadie se entera hasta que Alberto ve un teléfono mal formateado.
- **Código duplicado.** `normalizePhone` existe en `search/route.ts` y en `find-contact/route.ts`. `cleanWebsite` está en `lead-links.ts` pero `search/route.ts` tiene su propia versión inline.
- **Sin linting automatizado.** No hay ESLint configurado, no hay Prettier. El estilo de código varía entre OpenCode y Codex.
- **Variables mágicas.** `75000`, `1200`, `8000` — timeouts y tokens hardcodeados sin constantes con nombre.

### Veredicto

El código funciona pero es frágil. Sin tests, cualquier cambio en search/route.ts es un riesgo. **65/100.**

---

## 10. BUILD / DEPLOY — 70/100

### Lo que está bien ✅

- **Build limpio.** `npm run build` compila sin errores en <2 minutos.
- **RLS ejecutada.** La base de datos remota está protegida.
- **Smoke test script.** `scripts/smoke_leads_system.ps1` existe para verificar el sistema.

### Lo que falta ⚠️

- **No deployado a Vercel.** El sistema corre en `localhost:3000`. Si la laptop de Alberto se apaga, el sistema no existe.
- **Sin CI/CD.** No hay GitHub Actions. Cada deploy es manual.
- **Variables de entorno no documentadas en Vercel.** Están en `.env.local` pero no hay un `vercel.json` o dashboard configurado.

### Veredicto

El sistema compila pero no está en producción. **70/100.**

---

## 11. TESTING — 10/100

### Lo que está bien ✅

- Nada. Literalmente no hay tests. `npm run test` no existe en `package.json`.

### Lo que falta ❌

- Tests unitarios para `normalizePhone()`, `normalizeLeadCategoryValue()`, `cleanWebsite()`.
- Tests de integración para `POST /api/leads/search` con mock de Gemini.
- Tests E2E con Playwright o Cypress para el flujo completo: buscar → contactar → registrar outreach.

### Veredicto

0 tests es inaceptable para cualquier sistema que aspire a producción. **10/100.**

---

## 12. ESCALABILIDAD — 60/100

### Lo que está bien ✅

- **Paginación.** 25 leads por página, count exacto. Soporta 10,000 leads sin degradarse.
- **Rate limiting.** Evita abuso de Gemini.

### Lo que falta ⚠️

- **Búsqueda sincrónica.** Con 5 usuarios concurrentes buscando 20 leads cada uno, el servidor colapsa. Necesita async jobs.
- **Sin cache.** `GET /api/leads/list` y `GET /api/leads/stats` consultan la BD en cada request.
- **Single-tenant.** Si mañana quieren vender esto a otro parque, necesitan clonar todo el repo y la BD.

### Veredicto

Escala bien para 1-3 usuarios y <1000 leads. Para más, necesita async jobs y cache. **60/100.**

---

## 13. DOCUMENTACIÓN — 85/100

### Lo que está bien ✅

- **AGENTS.md.** Documenta reglas, arquitectura, áreas principales.
- **Handoffs.** `.agents/handoff-codex.md` y `.agents/handoff-opencode.md` para pasar contexto entre agentes.
- **Diagnóstico visual.** `docs/DIAGNOSTICO_COMPLETO.md` con mapas ASCII de arquitectura, flujos, estados.
- **Blueprint de plataforma.** `docs/LEADS_PLATFORM_BLUEPRINT.md` (en progreso) para productizar el sistema.
- **Supabase runbook.** `.agents/supabase-runbook.md` para operaciones de BD.

### Lo que falta ⚠️

- **Sin README para developers.** No hay instrucciones de `npm install`, `npm run dev`, variables de entorno.
- **Sin API docs.** No hay documentación de endpoints (OpenAPI/Swagger).

### Veredicto

Excelente para coordinación multi-agente. Falta para developers humanos. **85/100.**

---

## 14. VALOR COMERCIAL — 82/100

### Lo que está bien ✅

- **141 leads reales en la Araucanía.** No son datos falsos. Gemini los encontró en Google Maps, páginas amarillas, redes sociales.
- **84% tienen teléfono.** 119 de 141 leads son contactables por WhatsApp.
- **8 categorías cubren todo el mercado.** Desde productoras de eventos hasta municipalidades y colegios.
- **Costo operativo bajo.** Solo se paga Gemini API (~$15 CLP por lead) + Supabase (free tier) + Vercel (free tier).

### Lo que falta ⚠️

- **0 conversiones.** 17 outreach, 16 "contactado", 1 "respondió", 0 reuniones agendadas. El sistema genera leads pero no está demostrando que convierte.
- **Sin pricing definido.** Si van a vender esto como producto, ¿cuánto cobran? ¿Por lead? ¿Mensual? ¿Por usuario?
- **Sin diferenciación clara.** ¿Por qué esto es mejor que buscar en Google manualmente? La propuesta de valor necesita refinarse.

### Veredicto

El sistema tiene valor comercial real pero necesita demostrar conversión antes de venderse. **82/100.**

---

## 15. COLABORACIÓN MULTI-AGENTE — 88/100

### Lo que está bien ✅

- **AGENTS.md + handoffs.** El mecanismo de coordinación entre OpenCode y Codex funciona. Cada agente sabe qué hizo el otro.
- **División de trabajo clara.** OpenCode → arquitectura, seguridad, UX, refactor. Codex → categorización, verificación, calidad de datos.
- **Sin conflictos de merge.** 0 conflictos en 20+ commits colaborativos.

### Lo que falta ⚠️

- **Sin métricas de productividad.** ¿Cuántas líneas agregó cada agente? ¿Cuántos bugs introdujo? No hay tracking.
- **Sin code review automatizado.** No hay CI que revise el código antes de merge.

### Veredicto

La colaboración multi-agente es el aspecto más innovador del proyecto. **88/100.**

---

## PUNTAJE FINAL: 76.5/100

---

## LAS 5 COSAS QUE MÁS SUBEN EL PUNTAJE (ordenadas por impacto/esfuerzo)

| # | Acción | Sube a | Esfuerzo |
|---|--------|--------|----------|
| 1 | **Deploy a Vercel** — el sistema vive en producción | 80 | 15 min |
| 2 | **Migrar token a cookie httpOnly** — cierra el último hueco de seguridad | 82 | 30 min |
| 3 | **Refactor search/route.ts** — partir en 5 archivos | 84 | 2h |
| 4 | **Agregar tests** — al menos 10 tests unitarios para funciones críticas | 86 | 2h |
| 5 | **Async jobs para búsqueda** — desbloquea 20+ leads por búsqueda | 88 | 3h |

---

## OPINIÓN CONCRETA

El sistema es **el mejor prototipo funcional que he visto convertirse en herramienta real**. Pasó de ser un script que llamaba a Gemini y guardaba JSON a un sistema con auth, rate limiting, verificación de datos, 8 categorías tipadas, UI con toggle tabla/tarjetas, y documentación multi-agente.

**Lo que está genuinamente bien:** seguridad (RLS cerrada, dual Supabase, rate limiting), categorización (8 categorías con prompts, exclusiones, templates), colaboración multi-agente (handoffs, AGENTS.md, sin conflictos).

**Lo que está genuinamente mal:** 0 tests (inaceptable para producción), search/route.ts monolítico (826 líneas, frágil), sin deploy a Vercel (solo existe en localhost), 0 conversiones demostradas (17 outreach, 0 agendados).

**Si solo pudiera hacer una cosa:** deploy a Vercel. Todo lo demás es teórico hasta que el sistema esté vivo en una URL real. Alberto no puede usar `localhost:3000` para trabajar.

**Si pudiera hacer dos:** deploy + tests. Sin tests, cada cambio en search/route.ts es una ruleta rusa. Con 10 tests unitarios en las funciones críticas (`normalizePhone`, `normalizeLeadCategoryValue`, `cleanWebsite`), el sistema se vuelve mantenible.

**El gap al 90:** deploy (80) + tests (86) + async jobs (88) + refactor monolito (90). Son ~8 horas de trabajo. El gap al 100: CI/CD + Google Places API key + métricas de conversión en dashboard + onboarding UX. Otras ~8 horas.
