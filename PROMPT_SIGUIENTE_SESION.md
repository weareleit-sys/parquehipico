# PROMPT DE CONTEXTO: PARQUE HÍPICO (Fase de Consolidación y Expansión)

**Rol:** Eres un Arquitecto Frontend Senior y Director de Arte.
**Objetivo:** Expandir el "Rescate Visual" a las páginas interiores y perfeccionar la experiencia de usuario (UX/UI).

---

## 1. Estado Actual del Proyecto (✅ Hitos Completados)
*   **Homepage (`/inicio`):**
    *   ✅ **Hero:** Limpio, sin botones redundantes.
    *   ✅ **Servicios/Arrienda:** Diseño premium implementado.
    *   ✅ **Galería & Calendario:** Modo oscuro (Dark Mode) aplicado y consistente.
    *   ✅ **Floating WhatsApp:** Implementado con efecto de pulso y tooltip.
    *   ✅ **Footer:** Integrado, enlaces sociales actualizados, imports limpios.
*   **Infraestructura:**
    *   ✅ **Routing:** Redirección automática de `/` a `/inicio` en `app/page.tsx`.
    *   ✅ **Limpieza:** Archivos basura (`pagerespaldo.tsx`) eliminados.
    *   ✅ **Build:** `npm run build` exitoso. Desplegado en Vercel.

## 2. Stack Tecnológico
*   **Core:** Next.js 14 (App Router), TypeScript.
*   **Estilos:** Tailwind CSS (Configuración "catch-all" en `tailwind.config.ts` - NO TOCAR).
*   **Iconos:** `react-icons` (FaWhatsapp, FaInstagram, etc.).

## 3. Próximos Pasos (Tu Misión)

### A. Verificación de Producción
1.  Revisar la URL de Vercel (cuando el usuario la provea).
2.  Asegurar que los assets (imágenes) carguen correctamente en producción.

### B. Desarrollo de Páginas Interiores
Actualmente, la navegación apunta a rutas como `/eventos`, `/arrienda`, `/nosotros`.
*   **Acción:** Verificar si estas páginas tienen contenido real o son placeholders.
*   **Meta:** Aplicar el mismo estándar de diseño "Premium Dark" de la Home a estas secciones.
    *   *Referencia:* Usar `preview-modular-completo.html` (o similares) como guía visual.

### C. Optimización (Fase 2)
*   **Imágenes:** Evaluar migración progresiva de `<img>` a `next/image` para LCP (Largest Contentful Paint).
*   **SEO:** Agregar metadatos dinámicos en `layout.tsx` o `page.tsx`.

---

**Instrucción para la IA:**
Tu punto de partida es la carpeta `app/(sections)`.
Revisa el contenido de `eventos/page.tsx` o `arrienda/page.tsx`. Si están vacíos o básicos, tu tarea es **construirlos** usando los componentes ya creados (Navbar, Footer, FloatingWhatsApp) y creando nuevos componentes específicos para esas secciones, manteniendo la estética oscura y elegante.
