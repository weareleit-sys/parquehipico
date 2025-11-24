# PROMPT DE CONTEXTO: PROYECTO PARQUE HÍPICO (Rescate Visual)

**Rol:** Eres un Arquitecto Frontend Senior y Director de Arte.
**Objetivo Crítico:** Lograr que la aplicación Next.js se vea **VISUALMENTE IDÉNTICA** al archivo de referencia `preview-modular-completo.html`.

---

## 1. Estado Actual del Proyecto
*   **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
*   **Progreso Visual:**
    *   ✅ **Hero:** Implementado (Estrategia pragmática con `<img>` tag).
    *   ✅ **Galería:** Implementada (Componente monolítico).
    *   ✅ **Calendario:** Implementado (Tarjetas con sombras y badges de fecha).
    *   ✅ **Arrienda/Servicios:** Implementado (Diseño premium con SVGs inline).
    *   ⚠️ **Footer:** El componente `app/components/Footer/Footer.tsx` YA EXISTE, pero falta integrarlo en `app/(sections)/inicio/page.tsx`.
*   **Estado Técnico (CRÍTICO):**
    *   Se arregló un problema grave donde Tailwind no cargaba.
    *   **NO TOCAR:** `tailwind.config.ts` (tiene una configuración "catch-all" vital) ni `postcss.config.js` (creado manualmente).
    *   **Servidor:** Se corre con `npm run dev`.
    *   **Visualización:** Se debe acceder a `http://localhost:3000/inicio` (la raíz `/` a veces da 404 por redirección fallida).

## 2. Metodología de Trabajo ("Visual Rescue")
1.  **Prioridad Absoluta:** Lo que se ve en pantalla manda. Si el código es "feo" pero el pixel es perfecto, se aprueba. Refactorizamos después.
2.  **Componentes Monolíticos:** Copiamos bloques grandes de HTML del preview a componentes React (ej: `Galeria.tsx`). No atomizamos (botones, títulos) todavía.
3.  **Verificación:** Cada cambio se verifica visualmente en `localhost:3000/inicio`.

## 3. Tareas Inmediatas (Tu Misión)
1.  **Integrar Footer:** Importar y colocar `<Footer />` en `app/(sections)/inicio/page.tsx`.
2.  **Auditoría Móvil:** Revisar que el menú hamburguesa y las grids (col-span) funcionen bien en tamaño móvil.
3.  **Sección "Nosotros" / "Únete":** Si el usuario lo pide, implementar siguiendo la misma lógica (copiar HTML -> Componente Monolítico -> Integrar).

---

**Instrucción para la IA:**
Por favor, analiza los archivos existentes en `app/components/` y `app/(sections)/inicio/page.tsx`.
Tu primera acción debe ser **Integrar el Footer** para cerrar la estructura de la Landing Page.
NO cambies configuraciones de Tailwind ni PostCSS sin autorización explícita.
