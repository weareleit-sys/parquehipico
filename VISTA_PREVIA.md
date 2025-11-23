# ⚡ VISTA PREVIA RÁPIDA - Ver cambios al instante

## El problema
> "Se pierde mucho tiempo solo en ver los resultados"

## La solución
✅ **Carpeta `html-preview/`** con archivos HTML listos para ver al instante

---

## 🚀 USAR AHORA MISMO

### 1. Abre la carpeta `html-preview` en VS Code
```
parquehipico-nextjs/
└── html-preview/
    ├── index.html
    ├── carreras.html
    └── style.css
```

### 2. Instala "Live Preview" (Microsoft)
- Ctrl+Shift+X
- Busca "Live Preview"
- Click "Instalar"

### 3. Abre una página
- Click derecho en `index.html` o `carreras.html`
- Selecciona "Open with Live Preview"
- ¡Listo! Se abre en pestaña del navegador

### 4. Ver cambios
- Edita `style.css`
- **F5** para refrescar (o automático si Live Preview lo hace)
- ¡Los cambios aparecen instantáneamente!

---

## ⚡ VELOCIDAD

| Acción | Tiempo |
|--------|--------|
| Abrir HTML preview | **Instantáneo** ⚡ |
| Ver cambios CSS | **< 1 segundo** ⚡ |
| Refrescar (F5) | **< 1 segundo** ⚡ |
| **vs. Servidor Express** | **20-30 segundos** ⏱️ |

**Ahorro de tiempo: ~95%** 🎯

---

## 📋 ARCHIVO QUÉ EDITAR

```
📝 Edita SOLO: html-preview/style.css
├── Cambios de colores
├── Espaciado
├── Tamaños de fuente
├── Efectos hover
└── Responsive

❌ NO edites: index.html, carreras.html
(estos tienen la estructura, no necesitan cambios)
```

---

## 🎨 CAMBIOS TÍPICOS

### Cambiar color del header
```css
.header {
    background: var(--amarillo);  ← Cambiar aquí
}
```

### Cambiar tamaño de título
```css
.hero-title {
    font-size: clamp(2rem, 5vw, 3.5rem);  ← Cambiar aquí
}
```

### Cambiar tamaño de espacios
```css
.container {
    padding: 0 20px;  ← Cambiar aquí
}
```

---

## 📱 RESPONSIVE TESTING

Live Preview incluye:
- ✅ Vista desktop
- ✅ Vista tablet (redimensiona navegador)
- ✅ Vista móvil (abre DevTools: F12)

---

## 🔄 FLUJO RECOMENDADO

```
1. Cambios de DISEÑO
   ↓
2. Edita: html-preview/style.css
   ↓
3. F5 en Live Preview
   ↓
4. Ves cambios al instante ⚡
   ↓
5. ¿Te gusta? 
   └─ SÍ → Copias cambios a React/Next.js
   └─ NO → Ajustas en style.css (vuelve a paso 3)
```

---

## 💡 VENTAJAS

✅ **No esperas al servidor**
✅ **Cambios instantáneos**
✅ **Perfecto para iteración rápida**
✅ **Ideal para revisar con cliente**
✅ **Funciona offline**
✅ **No necesita Node.js corriendo**

---

## ⚠️ LIMITACIONES

❌ No ejecuta JavaScript dinámico
❌ No compila React
❌ No funciona para lógica (solo diseño)
❌ El botón de WhatsApp abre enlace (funciona)

**Solución:** Para probar funcionalidad completa, usa `/server-express.js`

---

## 🎯 RESUMEN

| Necesitas | Usar |
|-----------|------|
| **Ver diseño rápido** | `html-preview/` ⚡ |
| **Cambios de CSS** | `html-preview/` ⚡ |
| **Probar funcionalidad** | Servidor Express ⏱️ |
| **Probar JavaScript** | Servidor Express ⏱️ |

---

## 🚀 EMPIEZA AHORA

1. Abre `html-preview/index.html` con Live Preview
2. Edita `style.css`
3. F5 para ver cambios
4. ¡Disfruta de la velocidad! ⚡

**Ahora puedes iterar 30x más rápido en diseño.** 🎉




