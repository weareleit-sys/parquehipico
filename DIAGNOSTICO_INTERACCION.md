# 🎨 Auditoría Visual y de Experiencia: Parque Hípico La Montaña
## Prompt para Asistencia de Diseño (Cursor / GPT)

**MENSAJE CRÍTICO PARA LA IA:**
Olvida por un momento la "limpieza del código" o la "arquitectura". **El usuario final es humano y visual.** Si el código compila perfecto pero el sitio se ve feo o roto, el trabajo **NO SIRVE**.
Tu prioridad absoluta es la **Fidelidad Visual**.

---

### 1. 👁️ El Estándar Visual (La Meta)

Tenemos un diseño aprobado en HTML (`preview-modular-completo.html`) que tiene:
*   **Estética Premium:** Uso de sombras suaves, degradados elegantes y transparencias (glassmorphism).
*   **Tipografía con Carácter:** Fuentes `Poppins` y `Montserrat` que dan identidad.
*   **Imágenes Impactantes:** Un Hero section inmersivo a pantalla completa.

**Problema Actual:** La versión en Next.js **NO SE VE IGUAL**. Se siente "dura", "rota" o "genérica".

### 2. ❌ Los "Pecados Visuales" que estamos cometiendo

Necesitamos corregir esto inmediatamente. No me hables de componentes, háblame de píxeles y sensaciones:

1.  **El "Hero" no impacta:**
    *   En el diseño original, la imagen cubre toda la pantalla y el texto flota elegantemente sobre ella.
    *   En la versión actual, a veces la imagen no carga, o el texto queda pegado a los bordes, o la barra de navegación tapa el título.
    *   *Requerimiento:* Necesitamos que la primera impresión sea "WOW".

2.  **La Navegación es torpe:**
    *   El menú móvil debe sentirse como una app nativa (suave, animado), no como una lista de enlaces básicos.
    *   Las transparencias del Header deben funcionar perfecto al hacer scroll.

3.  **Falta de "Aire" y Ritmo:**
    *   Los elementos están muy pegados o muy separados. El diseño original tiene un ritmo visual específico (espaciados consistentes) que se ha perdido al pasar a React.

4.  **Detalles que matan la magia:**
    *   Bordes redondeados que se volvieron cuadrados.
    *   Sombras que desaparecieron.
    *   Colores que no son exactamente el `amber-500` o `slate-950` del diseño.

### 3. 🛠️ Instrucciones para la IA (Modo Diseñador)

Actúa como un **Director de Arte** que sabe programar.

1.  **Visual First:** Antes de cambiar una línea de código, pregúntate: "¿Esto hará que se vea mejor o peor?".
2.  **Respeta el CSS:** Si el HTML original tenía una clase `backdrop-blur-md`, el componente React **TIENE** que tenerla. No la borres por "limpiar".
3.  **Imágenes y Assets:** Asegúrate de que las rutas de las imágenes funcionen. Un cuadro gris donde debería haber un caballo corriendo es inaceptable.
4.  **Móvil es Prioridad:** La mayoría de la gente lo verá en su celular. Si se rompe en móvil, está roto.

**Tu Misión:**
Toma el código actual y **fuérzalo** a verse idéntico al `preview-modular-completo.html`. No me des excusas técnicas, dame soluciones visuales.

---
*Fin del Prompt de Auditoría Visual*
