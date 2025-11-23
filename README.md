# 🐴 Parque Hípico La Montaña - Next.js Full Stack

## 📋 Descripción

**Next.js 14 Full Stack Application** para Parque Hípico La Montaña con:
- ✅ Componentes React modularizados
- ✅ API Routes lista para Base de Datos
- ✅ TypeScript para type-safety
- ✅ CSS Modules para estilos aislados
- ✅ Server-side rendering (SSR) y Static Generation (SSG)
- ✅ SEO optimizado
- ✅ Rendimiento excelente

---

## 🚀 Comenzar

### 1. **Instalación**

```bash
# Instalar dependencias
npm install

# O con yarn
yarn install

# O con pnpm
pnpm install
```

### 2. **Variables de Entorno**

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus valores:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=Parque Hípico La Montaña
```

### 3. **Ejecutar en Desarrollo**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. **Build para Producción**

```bash
npm run build
npm run start
```

---

## 📁 Estructura del Proyecto

```
parquehipico-nextjs/
├── app/
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Página inicio
│   ├── globals.css                # Estilos globales
│   │
│   ├── components/
│   │   ├── Header.tsx            # Header reutilizable
│   │   ├── Header.module.css
│   │   ├── Footer.tsx            # Footer reutilizable
│   │   ├── Footer.module.css
│   │   ├── Navigation.tsx        # Navegación con dropdowns
│   │   ├── Navigation.module.css
│   │   ├── SocialLinks.tsx       # Redes sociales
│   │   ├── SocialLinks.module.css
│   │   │
│   │   └── sections/             # Componentes de secciones
│   │       ├── Carousel.tsx
│   │       ├── CalendarSection.tsx
│   │       └── SummaryLinks.tsx
│   │
│   ├── api/
│   │   └── route.ts              # API routes (para BD)
│   │
│   ├── (routes)/
│   │   ├── parquehipico/
│   │   ├── carreras/
│   │   ├── entretencion/
│   │   ├── eventos/
│   │   └── unete/
│   │
│   └── lib/
│       ├── db.ts                 # Conexión a BD
│       ├── config.ts             # Configuración centralizada
│       └── utils.ts              # Funciones utilitarias
│
├── public/
│   ├── logo-montana.png
│   └── (assets)
│
├── .env.example                  # Ejemplo de variables
├── .env.local                    # Variables locales (no commitear)
├── next.config.js                # Configuración Next.js
├── tsconfig.json                 # Configuración TypeScript
├── package.json
└── README.md
```

---

## 🎯 Características Principales

### ✨ Componentes Reutilizables

Todos los componentes están en `app/components/`:

- **Header** - Encabezado sticky con navegación
- **Navigation** - Menú dropdown interactivo
- **Footer** - Pie de página con información
- **SocialLinks** - Enlaces a redes sociales

### 🔄 Fácil de Mantener

**Cambiar el header:** 
```bash
Edita: app/components/Header.tsx
Se actualiza automáticamente en TODAS las páginas
```

**Cambiar colores:**
```bash
Edita: app/globals.css (variables CSS)
Se actualiza en TODO el sitio
```

### 🗄️ API Routes (Listos para BD)

```typescript
// app/api/eventos/route.ts
export async function GET() {
  // Conectar a BD aquí
  const eventos = await db.eventos.findAll();
  return Response.json(eventos);
}

export async function POST(request: Request) {
  const data = await request.json();
  // Guardar en BD
  const evento = await db.eventos.create(data);
  return Response.json(evento, { status: 201 });
}
```

### 📊 Server Components vs Client Components

- **Server Components (default):** ✅ SEO, seguridad
- **Client Components ('use client'):** ✅ Interactividad, hooks

---

## 🔧 Guía de Desarrollo

### Crear una Nueva Página

1. **Crear carpeta con su ruta:**
```bash
mkdir -p app/(routes)/mi-pagina
touch app/(routes)/mi-pagina/page.tsx
```

2. **Agregar contenido:**
```typescript
// app/(routes)/mi-pagina/page.tsx
export default function MiPagina() {
  return (
    <main>
      <div className="container">
        <h1>Mi Página</h1>
      </div>
    </main>
  );
}
```

3. **¡Listo!** Accesible en `/mi-pagina`

### Crear un Componente

1. **Archivo TypeScript:**
```typescript
// app/components/MiComponente.tsx
interface Props {
  titulo: string;
  contenido: string;
}

export default function MiComponente({ titulo, contenido }: Props) {
  return (
    <div>
      <h2>{titulo}</h2>
      <p>{contenido}</p>
    </div>
  );
}
```

2. **CSS Module (opcional):**
```css
/* app/components/MiComponente.module.css */
.container {
  padding: 20px;
}

.titulo {
  color: var(--azul);
}
```

3. **Usar en otra página:**
```typescript
import MiComponente from '@/app/components/MiComponente';

export default function Home() {
  return <MiComponente titulo="Hola" contenido="Mundo" />;
}
```

### Crear una API Route

```typescript
// app/api/eventos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const evento = await db.eventos.findById(params.id);
    return NextResponse.json(evento);
  } catch (error) {
    return NextResponse.json(
      { error: 'Evento no encontrado' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const data = await request.json();
  const evento = await db.eventos.update(params.id, data);
  return NextResponse.json(evento);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  await db.eventos.delete(params.id);
  return NextResponse.json({ success: true });
}
```

---

## 🗄️ Conexión a Base de Datos

### Ejemplo: Prisma + PostgreSQL

**1. Instalar Prisma:**
```bash
npm install @prisma/client
npm install -D prisma
```

**2. Inicializar:**
```bash
npx prisma init
```

**3. Configurar `.env.local`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/parquehipico"
```

**4. Crear schema (`prisma/schema.prisma`):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Evento {
  id        Int     @id @default(autoincrement())
  titulo    String
  fecha     DateTime
  descripcion String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**5. Migrar BD:**
```bash
npx prisma migrate dev --name init
```

**6. Usar en API:**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// app/api/eventos/route.ts
import { prisma } from '@/app/lib/db';

export async function GET() {
  const eventos = await prisma.evento.findMany();
  return Response.json(eventos);
}

export async function POST(request: Request) {
  const data = await request.json();
  const evento = await prisma.evento.create({
    data,
  });
  return Response.json(evento, { status: 201 });
}
```

---

## 📊 Variables CSS Disponibles

```css
/* Colores */
--amarillo: #FFD700
--negro: #1B1B1B
--azul: #0F3270
--rojo: #FF0000

/* Espaciado */
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px

/* Tipografía */
--font-poppins: 'Poppins', sans-serif
--font-size-base: 1rem
--font-weight-bold: 700

/* Y muchas más en app/globals.css */
```

---

## 🚀 Deployar a Producción

### Opción 1: Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Opción 2: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --production

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
```

### Opción 3: Otros Hosting

Next.js funciona en cualquier servidor Node.js:
- Railway
- Render
- Heroku
- DigitalOcean
- AWS

---

## 📝 Documentación

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs/) (si usas)

---

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Con coverage
npm run test:coverage
```

---

## 🐛 Troubleshooting

**Error: "Cannot find module..."**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Puerto 3000 en uso:**
```bash
npm run dev -- -p 3001
```

**Cambios no se reflejan:**
```bash
# Reiniciar servidor
npm run dev

# Limpiar cache
rm -rf .next
npm run dev
```

---

## 📞 Estructura para Conexión a BD

```typescript
// lib/db.ts - Centro único para conexión a BD
import { prisma } from '@prisma/client';

export const db = {
  eventos: {
    create: (data) => prisma.evento.create({ data }),
    findAll: () => prisma.evento.findMany(),
    findById: (id) => prisma.evento.findUnique({ where: { id } }),
    update: (id, data) => prisma.evento.update({ where: { id }, data }),
    delete: (id) => prisma.evento.delete({ where: { id } }),
  },
  // Agregar más modelos según necesites
};
```

---

## ✅ Checklist para Iniciar

- [ ] `npm install` completado
- [ ] `.env.local` configurado
- [ ] `npm run dev` funcionando
- [ ] Abrir http://localhost:3000
- [ ] Header, Footer y Navegación visibles
- [ ] Todos los estilos cargados correctamente

---

**¡Lista para Full Stack!** 🚀

Última actualización: Noviembre 2025  
Versión: 1.0 (Next.js 14)  
Status: ✅ Listo para desarrollo y BD

