# Diagnostico completo - Sistema de Leads Parque Hipico La Montana

Fecha de revision: 22 junio 2026  
Contexto: herramienta interna para usuarios no tecnicos, uso bajo, principalmente mobile.

## Veredicto ejecutivo

El sistema esta en buen estado como herramienta interna deployable, pero todavia no esta en nivel "producto perfecto". La arquitectura y seguridad estan bastante solidas; el punto mas debil no es el codigo nuevo, sino la calidad historica de datos ya guardados.

Nota honesta:

- Codigo local actual: 89/100
- Produccion si no incluye los ultimos commits locales: 84-86/100
- Calidad de base de datos actual: 78/100
- Potencial despues de limpieza de datos y ajustes UX: 92-94/100

Conclusion: se puede presentar y usar, especialmente para Turismo/Venues, Educacion, Gobierno/Municipal, Productoras y Matrimonios. Comunidad debe tratarse como categoria de revision, no como fuente principal de contactos listos.

## Estado Git y deploy

Repositorio real del proyecto:

```text
D:\Proyectos Antigravity\parquehipico\web
```

Estado al momento de esta revision:

```text
main...origin/main
```

Los cambios importantes de calidad ya estan en `origin/main`:

```text
d66c3fd Tighten weak lead category quality gates
da4ecca Separate ready and review search results
01e6f26 Add dry run lead search mode
```

Estos commits son relevantes. No son cosmeticos:

- agregan `dryRun` para probar busquedas sin guardar datos;
- separan resultados nuevos en "Listos para contactar" y "Revisar antes de contactar";
- endurecen filtros para categorias debiles como Comunidad, Matrimonios y Eventos familiares.

## Pruebas ejecutadas

Build:

```text
npm run build
PASS
```

Smoke local:

```text
Dashboard HTTP        PASS
Dashboard login HTTP  PASS
Auth login validation PASS
Auth logout           PASS
Lead list API         PASS
Stats API             PASS
Category counts       PASS
Empty save validation PASS
Supabase anon REST    PASS
```

El smoke confirma que:

- el dashboard carga;
- login/logout responden;
- las APIs principales funcionan;
- Supabase anon REST no expone leads publicamente;
- RLS y middleware estan cumpliendo el rol esperado.

## Pruebas de calidad con dryRun

Las siguientes busquedas se ejecutaron sin guardar datos en la base.

### Turismo / Zona Lacustre

Resultado:

```text
5 total
5 listos para contactar
0 revisar
```

Datos:

```text
5 con telefono
2 con WhatsApp
5 con website
3 con email
```

Evaluacion: excelente. Turismo/Venues es una de las mejores categorias para este negocio. Hoteles, centros turisticos, operadores y venues pueden derivar clientes o necesitar un espacio complementario mas grande y outdoor.

### Educacion / Temuco

Resultado:

```text
5 total
5 listos para contactar
0 revisar
```

Datos:

```text
5 con telefono
0 con WhatsApp
5 con website
5 con email
```

Evaluacion: fuerte. Aunque no haya WhatsApp, en instituciones educacionales el canal natural suele ser telefono fijo/email. Es una categoria defendible para jornadas, aniversarios, alianzas, licenciaturas y actividades masivas.

### Comunidad / Costa

Resultado:

```text
4 total
1 listo para contactar
3 revisar
1 filtrado por baja calidad o mal calce
```

Evaluacion: categoria util pero inestable. En zonas chicas existen organizaciones reales, pero muchas no tienen web o presencia digital fuerte. Correctamente el sistema las manda a revision antes de sugerir contacto directo.

## Metricas actuales de base de datos

```text
Total leads: 137
Pendientes: 120
Contactados: 11
Respondieron: 0
Agendados: 0
Descartados: 6
Buenos candidatos: 78
Prioridad alta verificada: 43
Necesitan verificacion vigente: 80
Verificados: 29
Parciales: 6
Conflicto / sin verificar: 22
Sin canal de contacto: 14
```

Distribucion por categoria:

```text
turismo: 18
corporativo: 25
productoras: 19
educacion: 14
matrimonios: 13
comunidad: 9
municipal: 12
cumpleanos/eventos familiares: 27
```

Lectura critica:

- El motor nuevo esta bastante bien.
- La base historica todavia no esta limpia.
- Hay demasiados leads con score alto pero sin verificacion vigente.
- El dashboard no deberia hacer sentir al usuario que todo lead score 9-10 esta listo si la verificacion no esta actualizada.

## Arquitectura

Nota: 88/100

Fortalezas:

- Next.js + Supabase + Gemini + Google Places es una arquitectura adecuada para uso interno.
- Las APIs estan protegidas por middleware.
- El server usa `SUPABASE_SERVICE_ROLE_KEY`; el browser no expone service role.
- RLS esta cerrada para anon/authenticated y permite acceso via service_role.
- `dryRun` permite testear calidad sin ensuciar la base.

Debilidades:

- `app/api/leads/search/route.ts` y `app/lib/lead-verification.ts` son grandes y concentran demasiada logica.
- Hay duplicacion de reglas entre normalizacion, scoring, categorias y verificacion.
- No hay suite automatizada de tests unitarios.
- No hay CI/CD formal.

Recomendacion:

Extraer en modulos:

- normalizacion de telefono;
- scoring de calidad;
- deduplicacion;
- parsing de Gemini;
- verificacion Places/web;
- formateo de respuesta para UI.

## Seguridad

Nota: 91/100

Fortalezas:

- Middleware protege `/dashboard`, `/api/leads/*` y `/api/outreach/*`.
- Login con Supabase Auth y cookie firmada.
- RLS cerrada.
- Service role solo en server.
- Rate limit por IP via funcion Postgres.
- Smoke confirma que Supabase anon REST no entrega leads.

Riesgos:

- El fallback por `?token=` sigue existiendo por compatibilidad. Es practico, pero menos limpio que cookie-only.
- Si se comparte accidentalmente una URL con token, puede quedar en historial/logs.
- El rate limit falla abierto si la RPC falla. Para herramienta interna puede aceptarse, pero no es ideal.

Recomendacion:

- Mantener cookie como metodo principal.
- Dejar `?token=` solo como emergencia temporal.
- A futuro, permitir solo usuarios Supabase autorizados por dominio/correo.

## Calidad de leads

Nota codigo actual: 90/100  
Nota datos actuales: 78/100

Fortalezas:

- Gemini usa Grounding.
- Google Places verifica identidad/zona.
- Crawler revisa web oficial.
- Limpieza de website y redes sociales evita muchos links falsos.
- Se descartan negocios fuera de zona.
- Se separan resultados entre listos y revision.

Debilidades:

- Redes sociales siguen siendo dificiles de verificar al 100%.
- Comunidad y organizaciones chicas tienen baja presencia digital.
- Algunos leads historicos quedaron con score alto y verificacion vieja o incompleta.
- Hay 14 leads sin canal de contacto.
- Hay 80 leads sin verificacion vigente.

Recomendacion:

Antes de presentar como sistema muy confiable, hacer limpieza por tandas:

```text
Revisar 5 datos
Repetir hasta bajar needsVerification de 80 a menos de 15
```

## Categorias

Nota: 87/100

Categorias fuertes:

- Turismo/Venues
- Educacion
- Municipal/Gobierno
- Productoras
- Matrimonios

Categorias utiles pero con cuidado:

- Corporativo: buena, pero debe evitar empresas que no organizan eventos.
- Eventos familiares: mejor que "cumpleanos", pero debe evitar tiendas de productos.
- Comunidad: util para oportunidades locales, pero debe entrar por defecto a revision si no hay verificacion fuerte.

Recomendacion:

No usar "cumpleanos" como concepto visible principal. Usar:

```text
Eventos familiares
```

Y mantener el filtro interno para excluir:

- cotillon;
- globos;
- tortas;
- regalos;
- decoracion aislada;
- tiendas de articulos de fiesta.

## UX y diseno para usuario poco tecnico

Nota: 86/100

Fortalezas:

- Vista tarjetas por defecto.
- Botones grandes para buscar, WhatsApp/llamar y cambiar estado.
- Resultados nuevos permanecen arriba despues de buscar.
- Separacion entre "Listos para contactar" y "Revisar antes de contactar".
- Mobile esta mejor encaminado que la vista tabla.

Debilidades:

- Aun hay demasiados badges, metricas y estados visibles.
- "Buenos candidatos", "Datos pendientes", "Revisar", "Prioridad alta" pueden confundirse.
- El usuario ideal necesita una ruta aun mas guiada.

Propuesta UX:

1. Buscar nuevos contactos
2. Contactar estos primero
3. Revisar dudosos
4. Historial / contactos ya trabajados

Regla visual recomendada:

- Verde: contactar ahora
- Amarillo: revisar
- Gris: descartado/no usar
- Azul: buscar datos faltantes

## Mobile

Nota: 88/100

Fortalezas:

- Tarjetas funcionan mejor que tabla.
- Acciones principales estan cerca del lead.
- WhatsApp/telefono son acciones naturales para celular.

Debilidades:

- La cabecera y estadisticas pueden ocupar demasiado espacio.
- La tabla deberia quedar secundaria o escondida en mobile.
- El flujo ideal para celular debe ser casi tipo checklist.

Recomendacion:

En mobile priorizar:

```text
Buscar
Listos para contactar
Revisar despues
```

La tabla debe ser solo para escritorio o administracion.

## Datos y metrica comercial

Nota: 76/100

El sistema ya puede buscar y contactar, pero todavia falta medir comercialmente bien.

Hoy mide:

- total;
- pendientes;
- contactados;
- respondieron;
- agendados;
- verificacion.

Falta medir mejor:

- tasa de contacto efectivo;
- respuesta por categoria;
- respuesta por sector;
- leads descartados por mala calidad;
- tiempo desde busqueda hasta contacto;
- motivo de rechazo;
- "proximo seguimiento".

Recomendacion:

Agregar campos o convenciones:

```text
fecha_proximo_contacto
motivo_rechazo
calidad_manual
responsable
```

## Verificacion y confianza

Nota: 87/100

El sistema esta bien encaminado, pero para acercarse a 95% necesita auditoria visible por lead.

Propuesta:

Cada lead deberia mostrar:

```text
Por que lo aceptamos:
- Google Places coincide
- Web activa
- Zona coincide
- Telefono encontrado
- Email encontrado
- Redes verificadas
```

Y cuando no calza:

```text
Por que revisar:
- no hay web oficial
- Google Places no encontro coincidencia
- telefono no verificable
- zona dudosa
```

Esto es clave para usuario no tecnico: no basta con que la IA decida; el sistema debe explicar con lenguaje simple.

## Principales riesgos reales

1. Datos historicos sin limpiar

Impacto: alto.  
Solucion: verificar por tandas hasta limpiar la base.

2. Score alto sin verificacion fuerte

Impacto: alto.  
Solucion: "Prioridad alta" solo si `score >= 9` y verificacion `verificado/parcial`.

3. Comunidad como categoria debil

Impacto: medio.  
Solucion: mantenerla, pero con revision por defecto si no hay fuente fuerte.

4. Dependencia de Gemini

Impacto: medio.  
Solucion: usar Places/crawler como verificador, no confiar ciegamente en Gemini.

5. Complejidad backend

Impacto: medio.  
Solucion: refactor por modulos despues de la presentacion.

## Plan recomendado para subir a 92-94

### Prioridad 1 - Antes de demo importante

- Confirmar que produccion este redeployada desde `origin/main`.
- Ejecutar limpieza de datos antiguos con `verify-missing`.
- Ajustar UI para que "Prioridad alta" dependa de verificacion vigente.
- Ocultar o suavizar metricas tecnicas para usuario final.

### Prioridad 2 - Despues de demo

- Refactor de `search/route.ts`.
- Refactor de `lead-verification.ts`.
- Tests unitarios para telefono, links, categoria, dedupe y scoring.
- Panel de auditoria por lead.
- Mejorar metricas comerciales.

### Prioridad 3 - Producto mas maduro

- CI/CD con build + smoke.
- Logs de busqueda por categoria/sector.
- Jobs async si el uso crece.
- Roles por usuario.
- Export CSV/Excel.
- Seguimientos programados.

## Recomendacion de presentacion al cliente

No vender como:

```text
La IA encuentra leads perfectos automaticamente.
```

Vender como:

```text
Sistema interno de prospeccion asistida con IA,
verificacion automatica y revision humana para datos dudosos.
```

Ese mensaje es correcto, defendible y evita prometer 100% donde ninguna IA puede garantizarlo.

## Estado final

El sistema esta presentable, pero con una condicion:

- Mostrar las categorias fuertes.
- Explicar que los datos dudosos quedan separados para revision.
- No prometer exactitud absoluta.
- Confirmar redeploy antes de probar en celular.

Nota final honesta:

```text
89/100 local
86/100 produccion actual
92-94/100 despues de deploy + limpieza de datos + ajuste visual de prioridad
```
