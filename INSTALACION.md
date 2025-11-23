# 🚀 GUÍA DE INSTALACIÓN RÁPIDA - Parque Hípico Next.js

## ⚡ Opción 1: Instalación Automática (Recomendado)

### Paso 1: Instalar Node.js

1. Ve a [https://nodejs.org](https://nodejs.org)
2. Descarga la versión **LTS** (recomendado)
3. Ejecuta el instalador y sigue los pasos

### Paso 2: Verificar Instalación

Abre PowerShell y escribe:

```powershell
node --version
npm --version
```

Deberías ver los números de versión (ej: v18.17.0, 9.8.1)

### Paso 3: Navegar a la Carpeta

```powershell
cd "C:\Users\alber\OneDrive\Documentos\parquehipico\parquehipico-nextjs"
```

### Paso 4: Instalar Dependencias

```powershell
npm install
```

Esto descargará todas las librerías necesarias (puede tardar 2-5 minutos)

### Paso 5: Ejecutar el Servidor

```powershell
npm run dev
```

Verás algo como:
```
> dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### Paso 6: Abrir en el Navegador

- Abre tu navegador favorito (Chrome, Firefox, Edge)
- Ve a: **http://localhost:3000**

¡Listo! 🎉

---

## 🛑 Si algo falla

### Error: "npm no se reconoce"

**Solución:**
1. Cierra PowerShell completamente
2. Reabre PowerShell
3. Reinicia la PC (si persiste)

### Error: "Puerto 3000 ya está en uso"

**Solución:**
```powershell
npm run dev -- -p 3001
```

Luego ve a: http://localhost:3001

### Error: "Cannot find module..."

**Solución:**
```powershell
npm install
```

(Ejecuta nuevamente)

### Error: "Module not found: @/app/..."

**Solución:**
```powershell
rm -r node_modules
npm install
npm run dev
```

---

## 📋 Comandos Principales

```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar en producción
npm run start

# Limpiar cache
rm -r .next
```

---

## 📁 Estructura del Código

```
parquehipico-nextjs/
├── app/
│   ├── page.tsx              ← Página principal
│   ├── layout.tsx            ← Estructura global
│   ├── globals.css           ← Estilos globales
│   ├── components/
│   │   ├── Header.tsx        ← Encabezado (editar aquí para cambios globales)
│   │   ├── Footer.tsx        ← Pie de página
│   │   └── Navigation.tsx    ← Menú
│   └── api/                  ← API Routes (para base de datos)
├── public/                   ← Imágenes, logos
└── README.md                 ← Documentación completa
```

---

## 🎯 Cambios Fáciles

### Cambiar el HEADER

Archivo: `app/components/Header.tsx`

Los cambios se reflejan automáticamente en TODAS las páginas ✨

### Cambiar COLORES

Archivo: `app/globals.css`

Busca las líneas tipo:
```css
--amarillo: #FFD700;
--azul: #0F3270;
```

Cambia los valores de color.

### Cambiar el MENÚ

Archivo: `app/components/Navigation.tsx`

Busca `navigationData` y edita los items.

### Cambiar REDES SOCIALES

Archivo: `app/components/SocialLinks.tsx`

Busca `socialLinks` y edita las URLs.

---

## 💾 Próximo Paso: Base de Datos

Cuando quieras conectar a base de datos:

1. Lee la sección "Conexión a Base de Datos" en `README.md`
2. Instala Prisma: `npm install @prisma/client prisma`
3. Configura tu DB en `.env.local`
4. Crea API routes en `app/api/`

---

## ✅ Checklist

- [ ] Node.js instalado (`node --version` funciona)
- [ ] Carpeta del proyecto abierta en PowerShell
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` muestra "Local: http://localhost:3000"
- [ ] Navegador muestra la página correctamente
- [ ] Header, Footer y Menú son visibles

---

## 📞 Ayuda

Si necesitas ayuda:

1. Lee `README.md` para documentación completa
2. Verifica `ESTRUCTURA.md` para entender el proyecto
3. Ve a [Next.js Docs](https://nextjs.org/docs)

---

**¡Ahora estás listo para desarrollar! 🚀**

Para seguir:
1. Lee `README.md` 
2. Explora la carpeta `app/components/`
3. Modifica `app/page.tsx` para agregar contenido
4. Crea nuevas páginas en `app/(routes)/`

¡Bienvenido a Next.js! 🎉

